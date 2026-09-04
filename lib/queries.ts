import type { SupabaseClient } from '@supabase/supabase-js';
import type { Article, Comment, NewsletterSubscriber } from '@/lib/types';
import { findArticleBySlug, isUuid } from '@/lib/slug';

type DbClient = SupabaseClient;

export async function fetchArticles(supabase: DbClient): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchArticleById(
  supabase: DbClient,
  id: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchArticleBySlug(
  supabase: DbClient,
  slug: string
): Promise<Article | null> {
  if (isUuid(slug)) {
    return fetchArticleById(supabase, slug);
  }

  const articles = await fetchArticles(supabase);
  return findArticleBySlug(articles, slug);
}

export async function fetchFeaturedArticle(supabase: DbClient): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchArticlesByCategory(
  supabase: DbClient,
  categoryId: string
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('category', categoryId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchArticlesByAuthor(
  supabase: DbClient,
  author: string
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('author', author)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function searchArticles(
  supabase: DbClient,
  query: string
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function incrementView(supabase: DbClient, id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_article_view', { article_uuid: id });
  if (error) console.error('Failed to increment view:', error);
}

export async function fetchComments(
  supabase: DbClient,
  articleId: string
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function subscribeNewsletter(
  supabase: DbClient,
  email: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email });
  return { error: error?.message ?? null };
}

// ===== Admin functions =====

export async function adminFetchAllArticles(supabase: DbClient): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateArticle(
  supabase: DbClient,
  article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views'>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('articles').insert(article);
  return { error: error?.message ?? null };
}

export async function adminUpdateArticle(
  supabase: DbClient,
  id: string,
  updates: Partial<Article>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('articles').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminDeleteArticle(
  supabase: DbClient,
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminFetchComments(supabase: DbClient): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminApproveComment(
  supabase: DbClient,
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('comments')
    .update({ is_approved: true })
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminDeleteComment(
  supabase: DbClient,
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminFetchSubscribers(
  supabase: DbClient
): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminDeleteSubscriber(
  supabase: DbClient,
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  return { error: error?.message ?? null };
}
