import { Shirt, Sparkles, Heart, Baby, UtensilsCrossed, Home } from 'lucide-react';
import Header from '@/components/Header';
import BreakingBar from '@/components/BreakingBar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import VideoSection from '@/components/VideoSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  fashionArticles,
  beautyArticles,
  familyArticles,
  foodArticles,
  decorArticles,
} from '@/data/articles';

export default function App() {
  const handleCategoryClick = (id: string) => {
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const section = document.getElementById(`section-${id}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Header onCategoryClick={handleCategoryClick} />
      <BreakingBar />
      <Hero />

      <main>
        <div id="section-fashion">
          <CategorySection
            title="أزياء"
            articles={fashionArticles}
            icon={<Shirt className="h-5 w-5 text-brand-500" />}
            accentColor="bg-brand-500"
          />
        </div>

        <div id="section-beauty">
          <CategorySection
            title="جمال ومكياج"
            articles={beautyArticles}
            icon={<Sparkles className="h-5 w-5 text-accent-500" />}
            accentColor="bg-accent-500"
          />
        </div>

        <div id="section-family">
          <CategorySection
            title="سيدتي وطفلك"
            articles={familyArticles}
            icon={<Baby className="h-5 w-5 text-sky-500" />}
            accentColor="bg-sky-500"
          />
        </div>

        <div id="section-food">
          <CategorySection
            title="مطبخ سيدتي"
            articles={foodArticles}
            icon={<UtensilsCrossed className="h-5 w-5 text-orange-500" />}
            accentColor="bg-orange-500"
          />
        </div>

        <div id="section-decor">
          <CategorySection
            title="المنزل والديكور"
            articles={decorArticles}
            icon={<Home className="h-5 w-5 text-violet-500" />}
            accentColor="bg-violet-500"
          />
        </div>

        <div id="section-video">
          <VideoSection />
        </div>

        <Newsletter />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
