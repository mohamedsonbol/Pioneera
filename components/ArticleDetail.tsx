'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Eye, MessageSquare } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getCategoryColor, getCategoryName } from '@/lib/types';
import { getAuthorSlug } from '@/lib/slug';
import ArticleCard from '@/components/ArticleCard';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleDetail({ article, relatedArticles }: ArticleDetailProps) {

  const formattedDate = new Date(article.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white">
      <div className="relative h-[300px] overflow-hidden sm:h-[450px]">
        <img
          src={article.image_url ?? ''}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 mx-auto max-w-4xl px-4 pb-8">
          <Link
            href="/"
            className="mb-4 flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </Link>
          <span className={`category-pill ${getCategoryColor(article.category)} text-white`}>
            {getCategoryName(article.category)}
          </span>
          <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-ink-300 sm:text-sm">
            <Link
              href={`/author/${getAuthorSlug(article.author)}`}
              className="transition-colors hover:text-white"
            >
              {article.author}
            </Link>
            <span>•</span>
            <span>{formattedDate}</span>
            {article.read_time && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.read_time}
                </span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.views} مشاهدة
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {article.excerpt && (
          <p className="mb-6 border-r-4 border-brand-500 pr-4 font-serif text-lg leading-relaxed text-ink-600">
            {article.excerpt}
          </p>
        )}

        <div className="whitespace-pre-wrap text-base leading-loose text-ink-700">
          {article.content}
        </div>

        <div className="mt-12 border-t border-ink-100 pt-8">
          <h3 className="mb-6 flex items-center gap-2 font-serif text-xl font-bold text-ink-800">
            <MessageSquare className="h-5 w-5 text-brand-500" />
            النقاش
          </h3>

          <div className="mb-8 rounded-xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-600">
            {!article.is_hot_topic ? 'التعليقات متاحة للموضوعات الساخنة فقط.' : article.comments_enabled ? 'نقاش الأعضاء سيتاح بعد تسجيل الدخول.' : 'النقاش مغلق.'}
          </div>

        </div>
      </div>

      {relatedArticles.length > 0 && (
        <div className="border-t border-ink-100 bg-ink-50 py-8">
          <div className="mx-auto max-w-7xl px-4">
            <h3 className="mb-5 font-serif text-xl font-bold text-ink-800">مقالات ذات صلة</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedArticles.slice(0, 4).map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
