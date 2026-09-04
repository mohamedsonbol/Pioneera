import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/types';

interface AuthorPageProps {
  authorName: string;
  articles: Article[];
  allArticles: Article[];
}

export default function AuthorPage({ authorName, articles, allArticles }: AuthorPageProps) {
  return (
    <div className="min-h-screen bg-ink-50">
      <Header articles={allArticles} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 font-serif text-3xl font-bold text-ink-800">{authorName}</h1>
        <p className="mb-6 text-sm text-ink-500">{articles.length} مقال</p>
        {articles.length === 0 ? (
          <p className="text-center text-ink-500">لا توجد مقالات لهذا الكاتب.</p>
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

export function AuthorNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-ink-500">الكاتب غير موجود</p>
      <Link
        href="/"
        className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
