import { Shirt, Sparkles, Heart, Baby, UtensilsCrossed, Home } from 'lucide-react';
import Header from '@/components/Header';
import BreakingBar from '@/components/BreakingBar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import VideoSection from '@/components/VideoSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { categories } from '@/lib/types';
import type { Article } from '@/lib/types';

interface HomePageProps {
  articles: Article[];
  featured: Article | null;
}

export default function HomePage({ articles, featured }: HomePageProps) {
  const articlesByCategory: Record<string, Article[]> = {};
  for (const cat of categories) {
    articlesByCategory[cat.id] = articles.filter((a) => a.category === cat.id);
  }

  const trendingArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  const secondaryArticles = articles.filter((a) => !a.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-ink-50">
      <Header articles={articles} />
      <BreakingBar articles={trendingArticles} />

      <Hero featured={featured} secondary={secondaryArticles} />

      <main>
        <div id="section-fashion">
          <CategorySection
            title="أزياء"
            articles={articlesByCategory.fashion ?? []}
            icon={<Shirt className="h-5 w-5 text-brand-500" />}
            accentColor="bg-brand-500"
          />
        </div>

        <div id="section-beauty">
          <CategorySection
            title="جمال ومكياج"
            articles={articlesByCategory.beauty ?? []}
            icon={<Sparkles className="h-5 w-5 text-accent-500" />}
            accentColor="bg-accent-500"
          />
        </div>

        <div id="section-family">
          <CategorySection
            title="سيدتي وطفلك"
            articles={articlesByCategory.family ?? []}
            icon={<Baby className="h-5 w-5 text-sky-500" />}
            accentColor="bg-sky-500"
          />
        </div>

        <div id="section-health">
          <CategorySection
            title="صحة"
            articles={articlesByCategory.health ?? []}
            icon={<Heart className="h-5 w-5 text-emerald-500" />}
            accentColor="bg-emerald-500"
          />
        </div>

        <div id="section-food">
          <CategorySection
            title="مطبخ Pioneera"
            articles={articlesByCategory.food ?? []}
            icon={<UtensilsCrossed className="h-5 w-5 text-orange-500" />}
            accentColor="bg-orange-500"
          />
        </div>

        <div id="section-decor">
          <CategorySection
            title="المنزل والديكور"
            articles={articlesByCategory.decor ?? []}
            icon={<Home className="h-5 w-5 text-violet-500" />}
            accentColor="bg-violet-500"
          />
        </div>

        <div id="section-stars">
          <CategorySection
            title="نجوم"
            articles={articlesByCategory.stars ?? []}
            accentColor="bg-rose-500"
          />
        </div>

        <div id="section-video">
          <VideoSection articles={articlesByCategory.video ?? []} />
        </div>

        <Newsletter />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
