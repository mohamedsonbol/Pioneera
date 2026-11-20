import type { Article } from '@/lib/types';

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
  const shortId = article.id?.split('-')[0] || 'unknown';
  return `${base}-${shortId}`;
}

export function getAuthorSlug(author: string): string {
  return slugify(author) || 'author';
}

export function getCategorySlug(categoryId: string): string {
  return categoryId;
}

export function findAuthorNameBySlug(articles: Article[], slug: string): string | null {
  const authors = [...new Set(articles.map((a) => a.author))];
  return authors.find((a) => getAuthorSlug(a) === slug) ?? null;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}
