import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/types';

interface CategoryPageProps {
  categoryName: string;
  articles: Article[];
  allArticles: Article[];
}

export default function CategoryPage({
  categoryName,
  articles,
  allArticles,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-ink-50">
      <Header articles={allArticles} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 font-serif text-3xl font-bold text-ink-800">{categoryName}</h1>
        {articles.length === 0 ? (
          <p className="text-center text-ink-500">لا توجد مقالات في هذا القسم حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
