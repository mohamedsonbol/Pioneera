import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchArticles } from '@/lib/queries';
import { findAuthorNameBySlug } from '@/lib/slug';
import AuthorPage from '@/components/AuthorPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const allArticles = await fetchArticles(supabase);
  const authorName = findAuthorNameBySlug(allArticles, slug);

  if (!authorName) return { title: 'الكاتب غير موجود' };

  return {
    title: authorName,
    description: `مقالات ${authorName} على Pioneera.net`,
  };
}

export default async function AuthorRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const allArticles = await fetchArticles(supabase);
  const authorName = findAuthorNameBySlug(allArticles, slug);

  if (!authorName) notFound();

  const articles = allArticles.filter((a) => a.author === authorName);

  return (
    <AuthorPage authorName={authorName} articles={articles} allArticles={allArticles} />
  );
}
