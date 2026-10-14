import sanitizeHtml from 'sanitize-html';

const DEFAULT_REVALIDATE_SECONDS = 60;
const REQUEST_TIMEOUT_MS = 8_000;
const WORDS_PER_MINUTE = 200;

export const WORDPRESS_ALLOWED_HTML = {
  tags: [
    'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote',
    'a', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'mark', 'small', 'sub', 'sup',
    'span', 'div', 'figure', 'figcaption', 'img', 'hr', 'pre', 'code', 'kbd', 'samp',
    'time', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'dl', 'dt', 'dd',
    'abbr', 'cite', 'q',
  ],
  attributes: {
    '*': ['class', 'id', 'dir', 'lang'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    blockquote: ['cite'],
    time: ['datetime'],
    ol: ['start', 'reversed'],
    li: ['value'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
    abbr: ['title'],
  },
};

export class EditorialConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EditorialConfigurationError';
  }
}

export class EditorialUnavailableError extends Error {
  constructor() {
    super('Editorial content is temporarily unavailable.');
    this.name = 'EditorialUnavailableError';
  }
}

export function getWordPressConfig(env = process.env) {
  if (env.CONTENT_SOURCE !== 'wordpress') {
    throw new EditorialConfigurationError(`Invalid CONTENT_SOURCE: ${env.CONTENT_SOURCE ?? 'missing'}. Supported value: wordpress.`);
  }

  const rawUrl = env.WORDPRESS_API_URL;
  if (!rawUrl) throw new EditorialConfigurationError('WORDPRESS_API_URL is required when CONTENT_SOURCE=wordpress.');

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new EditorialConfigurationError('WORDPRESS_API_URL must be a valid HTTPS WordPress REST API URL.');
  }

  if (url.protocol !== 'https:' || !url.hostname || !/\/wp-json\/wp\/v2\/?$/.test(url.pathname)) {
    throw new EditorialConfigurationError('WORDPRESS_API_URL must be an HTTPS URL ending in /wp-json/wp/v2.');
  }

  return { apiUrl: url.toString().replace(/\/$/, '') };
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, entity) => {
      const code = entity[0].toLowerCase() === 'x' ? Number.parseInt(entity.slice(1), 16) : Number.parseInt(entity, 10);
      return Number.isSafeInteger(code) ? String.fromCodePoint(code) : '';
    });
}

export function htmlToText(value) {
  if (typeof value !== 'string') return '';
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

export function sanitizeArticleHtml(value) {
  if (typeof value !== 'string' || !value.trim()) return null;

  const sanitized = sanitizeHtml(value, {
    allowedTags: WORDPRESS_ALLOWED_HTML.tags,
    allowedAttributes: WORDPRESS_ALLOWED_HTML.attributes,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'svg', 'math'],
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.target !== '_blank') return { tagName, attribs };
        const rel = new Set((attribs.rel ?? '').split(/\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        return { tagName, attribs: { ...attribs, rel: [...rel].join(' ') } };
      },
    },
  }).trim();

  return sanitized || null;
}

export function calculateReadingTime(text) {
  const wordCount = typeof text === 'string'
    ? (text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []).length
    : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} دقيقة قراءة`;
}

function embeddedItem(post, key) {
  const value = post?._embedded?.[key];
  return Array.isArray(value) ? value[0] : undefined;
}

function categoriesFrom(post) {
  const taxonomyGroups = post?._embedded?.['wp:term'];
  if (!Array.isArray(taxonomyGroups)) return [];

  // WordPress nests terms by taxonomy, so a post's categories can occur in any
  // group rather than only at _embedded['wp:term'][0]. Prefer explicit
  // category terms, while accepting older payloads that omit taxonomy.
  return taxonomyGroups
    .filter(Array.isArray)
    .flat()
    .filter((term) => term?.taxonomy === 'category' || (!term?.taxonomy && post?.categories?.includes?.(term?.id)));
}

function categoryFrom(post) {
  return categoriesFrom(post)[0] ?? null;
}

function isHotTopic(post) {
  return Boolean(post?.sticky || categoriesFrom(post).some((category) => (
    category?.slug === 'hot-topics' || category?.slug === 'hot-topic'
  )));
}

function authorFrom(post) {
  return embeddedItem(post, 'author') ?? null;
}

function featuredMediaFrom(post) {
  return embeddedItem(post, 'wp:featuredmedia') ?? null;
}

export function normalizeCategory(category) {
  if (!category || typeof category.id !== 'number' || typeof category.slug !== 'string') return null;
  return { id: String(category.id), slug: category.slug, name: htmlToText(category.name) || category.slug };
}

export function normalizeAuthor(author) {
  if (!author || typeof author.id !== 'number' || typeof author.slug !== 'string') return null;
  return { id: String(author.id), slug: author.slug, name: htmlToText(author.name) || author.slug };
}

export function normalizePost(post) {
  if (!post || typeof post.id !== 'number' || typeof post.slug !== 'string' || !post.slug) return null;
  const category = normalizeCategory(categoryFrom(post));
  const author = normalizeAuthor(authorFrom(post));
  const media = featuredMediaFrom(post);
  const imageUrl = typeof media?.source_url === 'string' ? media.source_url : null;
  const contentHtml = sanitizeArticleHtml(post.content?.rendered);
  const excerptHtml = sanitizeArticleHtml(post.excerpt?.rendered);
  const content = htmlToText(contentHtml ?? '');

  return {
    id: String(post.id),
    slug: post.slug,
    title: htmlToText(sanitizeArticleHtml(post.title?.rendered) ?? '') || post.slug,
    excerpt: htmlToText(excerptHtml ?? '') || null,
    content: content || null,
    content_html: contentHtml,
    category: category?.slug ?? '',
    category_name: category?.name ?? '',
    image_url: imageUrl,
    author: author?.name ?? '',
    author_slug: author?.slug ?? '',
    is_featured: Boolean(post.sticky),
    is_published: post.status === 'publish',
    views: 0,
    read_time: calculateReadingTime(content),
    created_at: typeof post.date_gmt === 'string' && post.date_gmt ? `${post.date_gmt}Z` : post.date ?? '',
    updated_at: typeof post.modified_gmt === 'string' && post.modified_gmt ? `${post.modified_gmt}Z` : post.modified ?? '',
    is_hot_topic: isHotTopic(post),
    comments_enabled: false,
  };
}

export function sanitizeSearch(raw) {
  return String(raw ?? '').trim().replace(/[^\p{L}\p{N}\s-]/gu, '').slice(0, 80);
}

function pagination(response) {
  const total = Number.parseInt(response.headers?.get?.('X-WP-Total') ?? '0', 10);
  const totalPages = Number.parseInt(response.headers?.get?.('X-WP-TotalPages') ?? '0', 10);
  return { total: Number.isFinite(total) ? total : 0, totalPages: Number.isFinite(totalPages) ? totalPages : 0 };
}

export function createWordPressRepository({ env = process.env, fetchImpl = fetch, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const config = () => getWordPressConfig(env);

  async function request(path, parameters = {}) {
    const { apiUrl } = config();
    const url = new URL(`${apiUrl}/${path}`);
    url.searchParams.set('_embed', '1');
    if (path === 'posts') url.searchParams.set('status', 'publish');
    Object.entries(parameters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, { signal: controller.signal, next: { revalidate: DEFAULT_REVALIDATE_SECONDS, tags: ['wordpress-editorial'] } });
      if (!response.ok) {
        if (response.status === 404 && path !== 'posts') return { data: [], page: { total: 0, totalPages: 0 } };
        throw new EditorialUnavailableError();
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new EditorialUnavailableError();
      return { data, page: pagination(response) };
    } catch (error) {
      if (error instanceof EditorialConfigurationError || error instanceof EditorialUnavailableError) throw error;
      throw new EditorialUnavailableError();
    } finally {
      clearTimeout(timer);
    }
  }

  async function posts(parameters = {}) {
    const initial = { per_page: 100, orderby: 'date', order: 'desc', ...parameters };
    const first = await request('posts', initial);
    const pages = Math.min(Math.max(first.page.totalPages, 1), 100);
    const remaining = await Promise.all(
      Array.from({ length: pages - 1 }, (_, index) => request('posts', { ...initial, page: index + 2 })),
    );
    return {
      articles: [first, ...remaining].flatMap(({ data }) => data.map(normalizePost).filter(Boolean)),
      page: first.page,
    };
  }

  async function categoryBySlug(slug) {
    const { data } = await request('categories', { slug, per_page: 1 });
    return normalizeCategory(data[0]);
  }

  async function authorBySlug(slug) {
    const { data } = await request('users', { slug, per_page: 1 });
    return normalizeAuthor(data[0]);
  }

  return {
    async allArticles() { return (await posts()).articles; },
    async featuredArticle() { return (await posts({ sticky: true, per_page: 1 })).articles[0] ?? null; },
    async hotTopics() { return (await posts()).articles.filter((article) => article.is_hot_topic); },
    async articleBySlug(slug) { return (await posts({ slug, per_page: 1 })).articles[0] ?? null; },
    async categoryArticles(slug) {
      const category = await categoryBySlug(slug);
      if (!category) return [];
      return (await posts({ categories: category.id })).articles;
    },
    async authorArticles(slug) {
      const author = await authorBySlug(slug);
      if (!author) return [];
      return (await posts({ author: author.id })).articles;
    },
    async searchArticles(raw) {
      const search = sanitizeSearch(raw);
      return search ? (await posts({ search, per_page: 30 })).articles : [];
    },
    categoryBySlug,
    authorBySlug,
  };
}

export const wordpressTestUtils = { DEFAULT_REVALIDATE_SECONDS, REQUEST_TIMEOUT_MS, htmlToText, pagination };
