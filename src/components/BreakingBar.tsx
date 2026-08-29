import { TrendingUp } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getCategoryName } from '@/lib/types';

interface BreakingBarProps {
  articles: Article[];
}

export default function BreakingBar({ articles }: BreakingBarProps) {
  if (articles.length === 0) return null;

  return (
    <div className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5">
        <div className="flex flex-shrink-0 items-center gap-2 rounded-full bg-brand-50 px-3 py-1">
          <TrendingUp className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-bold text-brand-600">الأكثر قراءة</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-600">
                <span className="font-bold text-brand-500">
                  #{(i % articles.length) + 1}
                </span>
                <span className="line-clamp-1">{article.title}</span>
                <span className="text-ink-300">|</span>
                <span className="text-ink-400">{getCategoryName(article.category)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
