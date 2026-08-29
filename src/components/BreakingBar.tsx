import { TrendingUp, ArrowLeft } from 'lucide-react';
import { trendingArticles, categories } from '@/data/articles';

export default function BreakingBar() {
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? '';

  return (
    <div className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5">
        <div className="flex flex-shrink-0 items-center gap-2 rounded-full bg-brand-50 px-3 py-1">
          <TrendingUp className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-bold text-brand-600">الأكثر قراءة</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...trendingArticles, ...trendingArticles].map((article, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-600">
                <span className="font-bold text-brand-500">#{i % trendingArticles.length + 1}</span>
                <span className="line-clamp-1">{article.title}</span>
                <span className="text-ink-300">|</span>
                <span className="text-ink-400">{getCategoryName(article.category)}</span>
              </div>
            ))}
          </div>
        </div>
        <ArrowLeft className="h-4 w-4 flex-shrink-0 text-ink-300" />
      </div>
    </div>
  );
}
