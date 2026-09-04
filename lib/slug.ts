import type { Article } from '@/lib/types';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a shareable article slug from title + short id (no DB slug column). */
export function getArticleSlug(article: Pick<Article, 'id' | 'title'>): string {
  const base = slugify(article.title) || 'article';
  const shortId = article.id.split('-')[0];
  return `${base}-${shortId}`;
}

export function getAuthorSlug(author: string): string {
  return slugify(author) || 'author';
}

export function getCategorySlug(categoryId: string): string {
  return categoryId;
}

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/** Extract the short id suffix from an article slug. */
export function extractShortIdFromArticleSlug(slug: string): string | null {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  return last && last.length >= 8 ? last : null;
}

export function findArticleBySlug(articles: Article[], slug: string): Article | null {
  if (isUuid(slug)) {
    return articles.find((a) => a.id === slug) ?? null;
  }

  const direct = articles.find((a) => getArticleSlug(a) === slug);
  if (direct) return direct;

  const shortId = extractShortIdFromArticleSlug(slug);
  if (shortId) {
    return articles.find((a) => a.id.startsWith(shortId)) ?? null;
  }

  return null;
}

export function findAuthorNameBySlug(articles: Article[], slug: string): string | null {
  const authors = [...new Set(articles.map((a) => a.author))];
  return authors.find((a) => getAuthorSlug(a) === slug) ?? null;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}
