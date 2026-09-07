import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allArticles as fetchAllArticles, authorArticles } from '@/lib/editorial/repository';
import { findAuthorNameBySlug } from '@/lib/slug';
import AuthorPage from '@/components/AuthorPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: authorSlug } = await params;
  const editorialArticles = await fetchAllArticles();
  const authorName = findAuthorNameBySlug(editorialArticles, authorSlug);

  if (!authorName) return { title: 'الكاتب غير موجود' };

  return {
    title: authorName,
    description: `مقالات ${authorName} على Pioneera.net`,
  };
}

export default async function AuthorRoutePage({ params }: PageProps) {
  const { slug: authorSlug } = await params;
  const editorialArticles = await fetchAllArticles();
  const authorName = findAuthorNameBySlug(editorialArticles, authorSlug);

  if (!authorName) notFound();

  const articles = await authorArticles(authorSlug);

  return (
    <AuthorPage authorName={authorName} articles={articles} allArticles={editorialArticles} />
  );
}
