import { useState, useEffect, useMemo } from 'react';
import { Shirt, Sparkles, Heart, Baby, UtensilsCrossed, Home } from 'lucide-react';
import Header from '@/components/Header';
import BreakingBar from '@/components/BreakingBar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import VideoSection from '@/components/VideoSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ArticleDetail from '@/components/ArticleDetail';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useArticles } from '@/lib/useArticles';
import { useAuth } from '@/lib/auth';
import { categories, getCategoryName } from '@/lib/types';
import type { Article } from '@/lib/types';

type View = 'home' | 'article' | 'admin';

export default function App() {
  const { articles, featured, loading } = useArticles();
  const { session } = useAuth();
  const [view, setView] = useState<View>('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleArticleClick = (id: string) => {
    setCurrentArticleId(id);
    setView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setView('home');
    setCurrentArticleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    if (view !== 'home') {
      handleBackHome();
    } else {
      if (id === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const section = document.getElementById(`section-${id}`);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handleAdminClick = () => {
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group articles by category
  const articlesByCategory = useMemo(() => {
    const map: Record<string, Article[]> = {};
    for (const cat of categories) {
      map[cat.id] = articles.filter((a) => a.category === cat.id);
    }
    return map;
  }, [articles]);

  // Trending articles (by views)
  const trendingArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  }, [articles]);

  // Secondary hero articles (non-featured, latest)
  const secondaryArticles = useMemo(() => {
    return articles.filter((a) => !a.is_featured).slice(0, 3);
  }, [articles]);

  // Related articles for detail page
  const relatedArticles = useMemo(() => {
    if (!currentArticleId) return [];
    const current = articles.find((a) => a.id === currentArticleId);
    if (!current) return [];
    return articles
      .filter((a) => a.id !== currentArticleId && a.category === current.category)
      .slice(0, 4);
  }, [currentArticleId, articles]);

  // ===== Admin View =====
  if (view === 'admin') {
    if (session) {
      return <AdminDashboard onBack={handleBackHome} />;
    }
    return <AdminLogin onBack={handleBackHome} />;
  }

  // ===== Article Detail View =====
  if (view === 'article' && currentArticleId) {
    return (
      <div className="min-h-screen bg-ink-50">
        <Header
          onCategoryClick={handleCategoryClick}
          onArticleClick={handleArticleClick}
          onAdminClick={handleAdminClick}
          articles={articles}
        />
        <ArticleDetail
          articleId={currentArticleId}
          onBack={handleBackHome}
          relatedArticles={relatedArticles}
          onArticleClick={handleArticleClick}
        />
        <Footer />
        <BackToTop />
      </div>
    );
  }

  // ===== Home View =====
  return (
    <div className="min-h-screen bg-ink-50">
      <Header
        onCategoryClick={handleCategoryClick}
        onArticleClick={handleArticleClick}
        onAdminClick={handleAdminClick}
        articles={articles}
      />
      <BreakingBar articles={trendingArticles} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-ink-400">جاري تحميل المقالات...</div>
        </div>
      ) : (
        <>
          <Hero
            featured={featured}
            secondary={secondaryArticles}
            onArticleClick={handleArticleClick}
          />

          <main>
            <div id="section-fashion">
              <CategorySection
                title="أزياء"
                articles={articlesByCategory.fashion ?? []}
                icon={<Shirt className="h-5 w-5 text-brand-500" />}
                accentColor="bg-brand-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-beauty">
              <CategorySection
                title="جمال ومكياج"
                articles={articlesByCategory.beauty ?? []}
                icon={<Sparkles className="h-5 w-5 text-accent-500" />}
                accentColor="bg-accent-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-family">
              <CategorySection
                title="سيدتي وطفلك"
                articles={articlesByCategory.family ?? []}
                icon={<Baby className="h-5 w-5 text-sky-500" />}
                accentColor="bg-sky-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-health">
              <CategorySection
                title="صحة"
                articles={articlesByCategory.health ?? []}
                icon={<Heart className="h-5 w-5 text-emerald-500" />}
                accentColor="bg-emerald-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-food">
              <CategorySection
                title="مطبخ Pioneera"
                articles={articlesByCategory.food ?? []}
                icon={<UtensilsCrossed className="h-5 w-5 text-orange-500" />}
                accentColor="bg-orange-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-decor">
              <CategorySection
                title="المنزل والديكور"
                articles={articlesByCategory.decor ?? []}
                icon={<Home className="h-5 w-5 text-violet-500" />}
                accentColor="bg-violet-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-stars">
              <CategorySection
                title="نجوم"
                articles={articlesByCategory.stars ?? []}
                accentColor="bg-rose-500"
                onArticleClick={handleArticleClick}
              />
            </div>

            <div id="section-video">
              <VideoSection
                articles={articlesByCategory.video ?? []}
                onArticleClick={handleArticleClick}
              />
            </div>

            <Newsletter />
          </main>
        </>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}
