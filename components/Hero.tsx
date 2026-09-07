'use client';

import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getCategoryColor, getCategoryName } from '@/lib/types';

interface HeroProps {
  featured: Article | null;
  secondary: Article[];
}

export default function Hero({ featured, secondary }: HeroProps) {
  if (!featured) return null;

  const formattedDate = new Date(featured.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Link
              href={`/article/${featured.slug!}`}
              className="article-card group block h-full cursor-pointer"
            >
              <div className="relative h-[280px] overflow-hidden sm:h-[420px] lg:h-[500px]">
                <img
                  src={featured.image_url ?? ''}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8">
                  <span
                    className={`category-pill ${getCategoryColor(featured.category)} text-white`}
                  >
                    {getCategoryName(featured.category)}
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-ink-200 sm:text-base">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-xs text-ink-300">
                    <span>{featured.author}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                    {featured.read_time && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featured.read_time}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                  <img
                    src="https://images.pexels.com/photos/30606975/pexels-photo-30606975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="غلاف Pioneera.net"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-white">
                  <p className="text-xs font-medium text-brand-100">عدد يوليو / أغسطس ٢٠٢٦</p>
                  <h3 className="mt-1 font-serif text-xl font-bold">مجلة Pioneera.net</h3>
                  <p className="mt-1 text-sm text-brand-100">النسخة الرقمية متاحة الآن</p>
                  <button className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-50">
                    اقرأ العدد
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {secondary.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug!}`}
                  className="article-card group flex cursor-pointer gap-3 p-2"
                >
                  <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={article.image_url ?? ''}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
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
                    <span className="mt-1 text-xs text-ink-400">
                      {new Date(article.created_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
