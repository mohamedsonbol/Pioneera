import { ArrowLeft } from 'lucide-react';
import ArticleCard from './ArticleCard';
import type { Article } from '@/data/articles';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  icon?: React.ReactNode;
  accentColor?: string;
}

export default function CategorySection({
  title,
  articles,
  icon,
  accentColor = 'bg-brand-500',
}: CategorySectionProps) {
  if (articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-7 w-1.5 rounded-full ${accentColor}`} />
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="font-serif text-xl font-bold text-ink-800 sm:text-2xl">{title}</h2>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700">
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <ArticleCard article={first} />
          </div>
          {rest.slice(0, 2).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
