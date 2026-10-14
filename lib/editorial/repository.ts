import 'server-only';
import { connection } from 'next/server';
import { createWordPressRepository } from './wordpress.mjs';
import type { Article } from '@/lib/types';

export interface EditorialCategory { id: string; slug: string; name: string; }
export interface EditorialAuthor { id: string; slug: string; name: string; }

// Keep CMS access here so route components consume editorial data, not REST details.
const repository = createWordPressRepository();
async function atRequestTime<T>(load: () => Promise<T>): Promise<T> {
  // CMS data is runtime content. Avoid contacting WordPress while building.
  await connection();
  return load();
}

export const allArticles = (): Promise<Article[]> => atRequestTime(() => repository.allArticles() as Promise<Article[]>);
export const featuredArticle = (): Promise<Article | null> => atRequestTime(() => repository.featuredArticle() as Promise<Article | null>);
export const hotTopics = (): Promise<Article[]> => atRequestTime(() => repository.hotTopics() as Promise<Article[]>);
export const articleBySlug = (slug: string): Promise<Article | null> => atRequestTime(() => repository.articleBySlug(slug) as Promise<Article | null>);
export const categoryArticles = (slug: string): Promise<Article[]> => atRequestTime(() => repository.categoryArticles(slug) as Promise<Article[]>);
export const authorArticles = (slug: string): Promise<Article[]> => atRequestTime(() => repository.authorArticles(slug) as Promise<Article[]>);
export const searchArticles = (term: string): Promise<Article[]> => atRequestTime(() => repository.searchArticles(term) as Promise<Article[]>);
export const categoryBySlug = (slug: string): Promise<EditorialCategory | null> => atRequestTime(() => repository.categoryBySlug(slug) as Promise<EditorialCategory | null>);
export const authorBySlug = (slug: string): Promise<EditorialAuthor | null> => atRequestTime(() => repository.authorBySlug(slug) as Promise<EditorialAuthor | null>);
