import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createWordPressRepository,
  EditorialConfigurationError,
  EditorialUnavailableError,
  calculateReadingTime,
  getWordPressConfig,
  normalizePost,
  sanitizeSearch,
  sanitizeArticleHtml,
} from '../lib/editorial/wordpress.mjs';
import { getArticleImageUrl } from '../lib/editorial/image.mjs';

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

// Matches the live WordPress shape for post ID 5: taxonomy terms are nested
// and hot-topics is a secondary classification category, not the display one.
const liveHotTopicsPost = {
  ...post,
  id: 5,
  slug: 'simple-morning-habits-balanced-day',
  sticky: false,
  categories: [4, 9],
  _embedded: {
    ...post._embedded,
    'wp:term': [[
      { id: 4, slug: 'health', name: 'Health', taxonomy: 'category' },
      { id: 9, slug: 'hot-topics', name: 'Hot topics', taxonomy: 'category' },
    ]],
  },
};

function response(data, { status = 200, total = 1, pages = 1 } = {}) {
  return { ok: status >= 200 && status < 300, status, headers: new Headers({ 'X-WP-Total': String(total), 'X-WP-TotalPages': String(pages) }), json: async () => data };
}

const env = { CONTENT_SOURCE: 'wordpress', WORDPRESS_API_URL: 'https://cms.pioneera.net/wp-json/wp/v2' };

test('normalizes WordPress post content, references, media, dates, and permanent slugs', () => {
  const article = normalizePost(post);
  assert.deepEqual(article, {
    id: '42', slug: 'wordpress-article', title: 'عنوان & اختبار', excerpt: 'ملخص آمن', content: 'نص المقال الثاني', content_html: '<p>نص المقال</p><p>الثاني</p>',
    category: 'beauty', category_name: 'جمال', image_url: 'https://cms.pioneera.net/image.jpg', author: 'ليلى', author_slug: 'layla-test',
    is_featured: true, is_published: true, views: 0, read_time: '1 دقيقة قراءة', created_at: '2026-10-01T12:00:00Z', updated_at: '2026-10-02T12:00:00Z', is_hot_topic: true, comments_enabled: false,
  });
});

test('normalization safely handles missing media and embedded references', () => {
  const article = normalizePost({ ...post, _embedded: {} });
  assert.equal(article.image_url, null);
  assert.equal(article.category, '');
  assert.equal(article.author, '');
  assert.equal(article.content_html, '<p>نص المقال</p><p>الثاني</p>');
  assert.equal(article.comments_enabled, false);
});

test('classifies every assigned embedded category without replacing the primary editorial category', () => {
  const liveArticle = normalizePost(liveHotTopicsPost);
  assert.equal(liveArticle.is_hot_topic, true);
  assert.equal(liveArticle.category, 'health');
  assert.equal(liveArticle.category_name, 'Health');

  const reversedAssignedIds = normalizePost({ ...liveHotTopicsPost, categories: [9, 4] });
  assert.equal(reversedAssignedIds.is_hot_topic, true);
  assert.equal(reversedAssignedIds.category, 'health');

  const reversedEmbeddedTerms = normalizePost({
    ...liveHotTopicsPost,
    _embedded: { ...liveHotTopicsPost._embedded, 'wp:term': [[
      { id: 9, slug: 'hot-topics', name: 'Hot topics', taxonomy: 'category' },
      { id: 4, slug: 'health', name: 'Health', taxonomy: 'category' },
    ]] },
  });
  assert.equal(reversedEmbeddedTerms.is_hot_topic, true);

  const stickyWithoutTopicCategory = normalizePost({ ...liveHotTopicsPost, sticky: true, _embedded: { ...liveHotTopicsPost._embedded, 'wp:term': [[{ id: 4, slug: 'health', name: 'Health', taxonomy: 'category' }]] } });
  assert.equal(stickyWithoutTopicCategory.is_hot_topic, true);

  const healthOnly = normalizePost({ ...liveHotTopicsPost, sticky: false, _embedded: { ...liveHotTopicsPost._embedded, 'wp:term': [[{ id: 4, slug: 'health', name: 'Health', taxonomy: 'category' }]] } });
  assert.equal(healthOnly.is_hot_topic, false);
});

test('preserves safe WordPress rich HTML while providing a plain-text representation', () => {
  const html = '<h2 class="wp-block-heading">عنوان</h2><p>نص <strong>مهم</strong> <a href="https://example.com" target="_blank">رابط</a></p><figure class="wp-block-image"><img src="https://cms.pioneera.net/image.jpg" alt="وصف" loading="lazy"><figcaption>تعليق</figcaption></figure><ul><li>عنصر</li></ul>';
  const article = normalizePost({ ...post, content: { rendered: html } });
  assert.match(article.content_html, /<h2 class="wp-block-heading">عنوان<\/h2>/);
  assert.match(article.content_html, /<a href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer">رابط<\/a>/);
  assert.match(article.content_html, /<figure class="wp-block-image">/);
  assert.match(article.content_html, /<img src="https:\/\/cms\.pioneera\.net\/image\.jpg" alt="وصف" loading="lazy" \/>/);
  assert.equal(article.content, 'عنوان نص مهم رابط تعليق عنصر');
});

test('removes malicious HTML, event attributes, unsafe URLs, and dangerous elements', () => {
  const html = '<p onclick="alert(1)">نص</p><script>alert(1)</script><iframe src="https://evil.example"></iframe><a href="javascript:alert(1)" onmouseover="alert(1)">رابط</a><img src="javascript:alert(1)" onerror="alert(1)"><img src="https://cms.pioneera.net/safe.jpg" onerror="alert(1)">';
  const sanitized = sanitizeArticleHtml(html);
  assert.equal(sanitized.includes('script'), false);
  assert.equal(sanitized.includes('iframe'), false);
  assert.equal(sanitized.includes('alert(1)'), false);
  assert.equal(sanitized.includes('onclick'), false);
  assert.equal(sanitized.includes('onerror'), false);
  assert.equal(sanitized.includes('javascript:'), false);
  assert.match(sanitized, /<img src="https:\/\/cms\.pioneera\.net\/safe\.jpg" \/>/);
});

test('calculates deterministic Arabic, English, mixed, and empty reading times', () => {
  assert.equal(calculateReadingTime('كلمة '.repeat(200)), '1 دقيقة قراءة');
  assert.equal(calculateReadingTime('word '.repeat(201)), '2 دقيقة قراءة');
  assert.equal(calculateReadingTime(`${'كلمة '.repeat(100)}${'word '.repeat(101)}`), '2 دقيقة قراءة');
  assert.equal(calculateReadingTime(''), '1 دقيقة قراءة');
});

test('uses a null image source to select the accessible editorial placeholder', () => {
  assert.equal(getArticleImageUrl(null), null);
  assert.equal(getArticleImageUrl('   '), null);
  assert.equal(getArticleImageUrl('https://cms.pioneera.net/image.jpg'), 'https://cms.pioneera.net/image.jpg');
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

test('hot-topics repository result includes the live-shaped secondary category fixture', async () => {
  let requestOptions;
  const repository = createWordPressRepository({
    env,
    fetchImpl: async (_url, options) => {
      requestOptions = options;
      return response([liveHotTopicsPost]);
    },
  });
  assert.deepEqual((await repository.hotTopics()).map((article) => article.slug), ['simple-morning-habits-balanced-day']);
  assert.equal(requestOptions.cache, 'no-store');
  assert.equal(requestOptions.next, undefined);
});

test('listing follows WordPress pagination headers', async () => {
  const repository = createWordPressRepository({
    env,
    fetchImpl: async (url) => response([{ ...post, id: Number(new URL(url).searchParams.get('page') ?? 1) }], { total: 2, pages: 2 }),
  });
  const articles = await repository.allArticles();
  assert.deepEqual(articles.map((article) => article.id), ['1', '2']);
});

test('WordPress publication ordering remains the source for the latest-articles strip', async () => {
  const newer = { ...post, id: 43, slug: 'newer', date_gmt: '2026-10-03T12:00:00' };
  const repository = createWordPressRepository({ env, fetchImpl: async () => response([newer, post]) });
  assert.deepEqual((await repository.allArticles()).map((article) => article.slug), ['newer', 'wordpress-article']);

  const { readFile } = await import('node:fs/promises');
  const [home, bar] = await Promise.all([
    readFile(new URL('../components/HomePage.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/BreakingBar.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(home, /articles\.slice\(0, 5\)/);
  assert.doesNotMatch(home, /\.views/);
  assert.match(bar, /أحدث المقالات/);
  assert.doesNotMatch(bar, /الأكثر قراءة/);
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

test('public editorial routes use the repository and no longer depend on Sanity editorial APIs', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const path of ['../app/page.tsx', '../app/latest/page.tsx', '../app/hot-topics/page.tsx', '../app/search/page.tsx', '../app/article/[slug]/page.tsx', '../app/category/[slug]/page.tsx', '../app/author/[slug]/page.tsx']) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /lib\/editorial\/repository/);
    assert.doesNotMatch(source, /sanity|fetch\(/i);
  }
});

test('editorial image consumers use the fallback component and never an empty image source', async () => {
  const { readFile } = await import('node:fs/promises');
  const paths = ['../components/ArticleCard.tsx', '../components/Hero.tsx', '../components/VideoSection.tsx', '../components/Header.tsx', '../components/ArticleDetail.tsx'];
  const sources = await Promise.all(paths.map((path) => readFile(new URL(path, import.meta.url), 'utf8')));
  for (const source of sources) {
    assert.match(source, /ArticleImage/);
    assert.doesNotMatch(source, /src=\{[^}]*\?\?\s*''/);
  }
  const image = await readFile(new URL('../components/ArticleImage.tsx', import.meta.url), 'utf8');
  assert.match(image, /if \(imageUrl\)/);
  assert.match(image, /article-image-placeholder/);
});

 test('successive page requests see newly published CMS content without a cache window', async () => {
  let published = [post];
  const repository = createWordPressRepository({ env, fetchImpl: async (_url, options) => {
    assert.equal(options.cache, 'no-store');
    return response(published);
  } });
  assert.equal((await repository.allArticles()).length, 1);
  published = [{ ...post, id: 43, slug: 'newly-published' }, post];
  assert.equal((await repository.allArticles())[0].slug, 'newly-published');
});
