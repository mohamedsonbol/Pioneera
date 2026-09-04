'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getCategoryColor, getCategoryName } from '@/lib/types';
import { getArticleSlug } from '@/lib/slug';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const date = new Date(article.created_at).toLocaleDateString('ar-EG');
  const image = article.image_url ?? '';
  const href = `/article/${getArticleSlug(article)}`;

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="article-card group flex gap-3 p-2">
        <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={image} alt={article.title} className="h-full w-full object-cover" />
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
            <span>{date}</span>
            {article.read_time && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.read_time}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="article-card group flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={article.title} className="h-full w-full object-cover" />
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
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-ink-400">
          <span>{date}</span>
          {article.read_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.read_time}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
