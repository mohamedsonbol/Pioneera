import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articleBySlug, allArticles as fetchAllArticles } from '@/lib/editorial/repository';
import { getSiteUrl } from '@/lib/slug';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ArticleDetail from '@/components/ArticleDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleBySlug(slug);

  if (!article) {
    return { title: 'المقال غير موجود' };
  }

  const canonical = `${getSiteUrl()}/article/${article.slug!}`;
  const description = article.excerpt ?? article.title;

  return {
    title: article.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description,
      url: canonical,
      type: 'article',
      locale: 'ar_SA',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: [article.author],
      images: article.image_url ? [{ url: article.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [article, editorialArticles] = await Promise.all([
    articleBySlug(slug), fetchAllArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = editorialArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-ink-50">
      <Header articles={editorialArticles} />
      <ArticleDetail article={article} relatedArticles={relatedArticles} />
      <Footer />
      <BackToTop />
    </div>
  );
}
