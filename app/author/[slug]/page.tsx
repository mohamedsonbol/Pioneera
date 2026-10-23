import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allArticles as fetchAllArticles, authorArticles, authorBySlug } from '@/lib/editorial/repository';
import AuthorPage from '@/components/AuthorPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: authorSlug } = await params;
  const author = await authorBySlug(authorSlug);

  if (!author) return { title: 'الكاتب غير موجود' };

  return {
    title: author.name,
    description: `مقالات ${author.name} على Pioneera`,
  };
}

export default async function AuthorRoutePage({ params }: PageProps) {
  const { slug: authorSlug } = await params;
  const [editorialArticles, author] = await Promise.all([fetchAllArticles(), authorBySlug(authorSlug)]);

  if (!author) notFound();

  const articles = await authorArticles(authorSlug);

  return (
    <AuthorPage authorName={author.name} articles={articles} allArticles={editorialArticles} />
  );
}
