import { Clock } from 'lucide-react';
import type { Article } from '@/data/articles';
import { categories } from '@/data/articles';

function getCategoryColor(id: string) {
  return categories.find((c) => c.id === id)?.color ?? 'bg-brand-500';
}
function getCategoryName(id: string) {
  return categories.find((c) => c.id === id)?.name ?? '';
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'horizontal') {
    return (
      <article className="article-card group flex gap-3 p-2">
        <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <span
            className={`category-pill ${getCategoryColor(article.category)} mb-1.5 self-start text-white`}
          >
            {getCategoryName(article.category)}
          </span>
          <h4 className="line-clamp-2 text-sm font-bold leading-snug text-ink-800 group-hover:text-brand-600">
            {article.title}
          </h4>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-400">
            <span>{article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="article-card group flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        <span
          className={`category-pill ${getCategoryColor(article.category)} absolute top-3 right-3 text-white shadow-sm`}
        >
          {getCategoryName(article.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink-800 group-hover:text-brand-600">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-500">{article.excerpt}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-ink-400">
          <span>{article.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}
