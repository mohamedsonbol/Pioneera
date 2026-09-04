import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchArticles, fetchArticlesByCategory } from '@/lib/queries';
import { getCategoryBySlug, getCategoryName } from '@/lib/types';
import CategoryPage from '@/components/CategoryPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'القسم غير موجود' };

  const name = getCategoryName(slug);
  return {
    title: name,
    description: `اقرأي أحدث مقالات ${name} على Pioneera.net`,
  };
}

export default async function CategoryRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const supabase = await createClient();
  const [articles, allArticles] = await Promise.all([
    fetchArticlesByCategory(supabase, slug),
    fetchArticles(supabase),
  ]);

  return (
    <CategoryPage
      categoryName={getCategoryName(slug)}
      articles={articles}
      allArticles={allArticles}
    />
  );
}
