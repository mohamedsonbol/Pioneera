import { supabase } from '@/lib/supabase';
import type { Article, Comment, NewsletterSubscriber } from '@/lib/types';

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
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

export async function searchArticles(query: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function incrementView(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_article_view', { article_uuid: id });
  if (error) console.error('Failed to increment view:', error);
}

export async function fetchComments(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(
  articleId: string,
  name: string,
  content: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('comments').insert({
    article_id: articleId,
    name,
    content,
  });
  return { error: error?.message ?? null };
}

export async function subscribeNewsletter(
  email: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email });
  return { error: error?.message ?? null };
}

// ===== Admin functions =====

export async function adminFetchAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateArticle(
  article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views'>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('articles').insert(article);
  return { error: error?.message ?? null };
}

export async function adminUpdateArticle(
  id: string,
  updates: Partial<Article>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('articles').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminDeleteArticle(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminFetchComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminApproveComment(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('comments')
    .update({ is_approved: true })
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminDeleteComment(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function adminFetchSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminDeleteSubscriber(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  return { error: error?.message ?? null };
}
