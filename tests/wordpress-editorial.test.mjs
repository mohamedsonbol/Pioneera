import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createWordPressRepository,
  EditorialConfigurationError,
  EditorialUnavailableError,
  getWordPressConfig,
  normalizePost,
  sanitizeSearch,
} from '../lib/editorial/wordpress.mjs';

const category = { id: 7, slug: 'beauty', name: 'جمال', taxonomy: 'category' };
const author = { id: 3, slug: 'layla-test', name: 'ليلى' };
const post = {
  id: 42, slug: 'wordpress-article', status: 'publish', sticky: true,
  date_gmt: '2026-10-01T12:00:00', modified_gmt: '2026-10-02T12:00:00',
  title: { rendered: '<em>عنوان &amp; اختبار</em>' },
  excerpt: { rendered: '<p>ملخص <strong>آمن</strong></p>' },
  content: { rendered: '<p>نص المقال</p><p>الثاني</p>' },
  _embedded: {
    author: [author],
    'wp:featuredmedia': [{ source_url: 'https://cms.pioneera.net/image.jpg' }],
    'wp:term': [[category]],
  },
};

function response(data, { status = 200, total = 1, pages = 1 } = {}) {
  return { ok: status >= 200 && status < 300, status, headers: new Headers({ 'X-WP-Total': String(total), 'X-WP-TotalPages': String(pages) }), json: async () => data };
}

const env = { CONTENT_SOURCE: 'wordpress', WORDPRESS_API_URL: 'https://cms.pioneera.net/wp-json/wp/v2' };

test('normalizes WordPress post content, references, media, dates, and permanent slugs', () => {
  const article = normalizePost(post);
  assert.deepEqual(article, {
    id: '42', slug: 'wordpress-article', title: 'عنوان & اختبار', excerpt: 'ملخص آمن', content: 'نص المقال الثاني',
    category: 'beauty', category_name: 'جمال', image_url: 'https://cms.pioneera.net/image.jpg', author: 'ليلى', author_slug: 'layla-test',
    is_featured: true, is_published: true, views: 0, read_time: null, created_at: '2026-10-01T12:00:00Z', updated_at: '2026-10-02T12:00:00Z', is_hot_topic: true, comments_enabled: false,
  });
});

test('normalization safely handles missing media and embedded references', () => {
  const article = normalizePost({ ...post, _embedded: {} });
  assert.equal(article.image_url, null);
  assert.equal(article.category, '');
  assert.equal(article.author, '');
  assert.equal(article.comments_enabled, false);
});

test('listing, search, category, author, and hot-topic queries use WordPress REST parameters', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    const parsed = new URL(url); calls.push(parsed);
    const route = parsed.pathname.split('/').at(-1);
    if (route === 'categories') return response([category]);
    if (route === 'users') return response([author]);
    return response([post]);
  };
  const repository = createWordPressRepository({ env, fetchImpl });
  assert.equal((await repository.allArticles()).length, 1);
  assert.equal((await repository.searchArticles(' <اختبار> ')).length, 1);
  assert.equal((await repository.categoryArticles('beauty')).length, 1);
  assert.equal((await repository.authorArticles('layla-test')).length, 1);
  assert.equal((await repository.hotTopics()).length, 1);
  assert.ok(calls.every((call) => call.searchParams.get('_embed') === '1'));
  assert.equal(calls.find((call) => call.searchParams.has('search')).searchParams.get('search'), 'اختبار');
  assert.equal(calls.find((call) => call.searchParams.has('categories')).searchParams.get('categories'), '7');
  assert.equal(calls.find((call) => call.searchParams.has('author')).searchParams.get('author'), '3');
});

test('listing follows WordPress pagination headers', async () => {
  const repository = createWordPressRepository({
    env,
    fetchImpl: async (url) => response([{ ...post, id: Number(new URL(url).searchParams.get('page') ?? 1) }], { total: 2, pages: 2 }),
  });
  const articles = await repository.allArticles();
  assert.deepEqual(articles.map((article) => article.id), ['1', '2']);
});

test('search is bounded and sanitized', () => {
  const value = sanitizeSearch(` <script>${'أ'.repeat(100)}</script> `);
  assert.ok(value.length <= 80);
  assert.doesNotMatch(value, /[<>]/);
});

test('REST failures and timeouts expose sanitized editorial errors', async () => {
  const failed = createWordPressRepository({ env, fetchImpl: async () => response({ code: 'server_error' }, { status: 500 }) });
  await assert.rejects(failed.allArticles(), EditorialUnavailableError);
  const timedOut = createWordPressRepository({ env, timeoutMs: 1, fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('timeout')))) });
  await assert.rejects(timedOut.allArticles(), EditorialUnavailableError);
});

test('configuration rejects missing, unsupported, and unsafe WordPress endpoints', () => {
  assert.throws(() => getWordPressConfig({}), EditorialConfigurationError);
  assert.throws(() => getWordPressConfig({ CONTENT_SOURCE: 'sanity', WORDPRESS_API_URL: env.WORDPRESS_API_URL }), EditorialConfigurationError);
  assert.throws(() => getWordPressConfig({ CONTENT_SOURCE: 'wordpress', WORDPRESS_API_URL: 'http://cms.pioneera.net/wp-json/wp/v2' }), EditorialConfigurationError);
  assert.deepEqual(getWordPressConfig(env), { apiUrl: env.WORDPRESS_API_URL });
});

test('public editorial routes use the repository and no longer depend on Sanity or Supabase editorial APIs', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const path of ['../app/page.tsx', '../app/latest/page.tsx', '../app/hot-topics/page.tsx', '../app/search/page.tsx', '../app/article/[slug]/page.tsx', '../app/category/[slug]/page.tsx', '../app/author/[slug]/page.tsx']) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /lib\/editorial\/repository/);
    assert.doesNotMatch(source, /sanity|supabase|fetch\(/i);
  }
});
