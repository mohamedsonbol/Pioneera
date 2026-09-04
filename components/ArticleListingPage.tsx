import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/types';

interface ArticleListingPageProps {
  title: string;
  description?: string;
  articles: Article[];
  allArticles: Article[];
}

export default function ArticleListingPage({
  title,
  description,
  articles,
  allArticles,
}: ArticleListingPageProps) {
  return (
    <div className="min-h-screen bg-ink-50">
      <Header articles={allArticles} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-ink-800">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-500">{description}</p>}
        {articles.length === 0 ? (
          <p className="mt-10 rounded-xl bg-white p-8 text-center text-ink-500">
            لا توجد مقالات متاحة حالياً.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
