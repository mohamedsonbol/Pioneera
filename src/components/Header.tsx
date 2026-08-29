import { useState, useEffect } from 'react';
import { Search, Menu, X, Facebook, Instagram, Twitter, Youtube, Clock } from 'lucide-react';
import { categories } from '@/data/articles';

interface HeaderProps {
  onCategoryClick: (id: string) => void;
}

export default function Header({ onCategoryClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div
        className={`bg-ink-900 text-white transition-all duration-300 ${
          scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-10 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-ink-200">{today}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-ink-300 sm:inline">تابعنا على</span>
            <div className="flex items-center gap-3">
              <a href="#" className="text-ink-300 transition-colors hover:text-brand-400">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-ink-300 transition-colors hover:text-brand-400">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-ink-300 transition-colors hover:text-brand-400">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-ink-300 transition-colors hover:text-brand-400">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div
        className={`bg-white shadow-sm transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              className="text-ink-700 transition-colors hover:text-brand-600 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="القائمة"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1
              className={`font-serif font-bold text-brand-600 transition-all duration-300 ${
                scrolled ? 'text-2xl' : 'text-4xl'
              }`}
            >
              سيدتي
            </h1>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div
              className={`overflow-hidden transition-all duration-300 ${
                searchOpen ? 'w-48 sm:w-64' : 'w-0'
              }`}
            >
              <input
                type="text"
                placeholder="اكتب الكلمات الرئيسية فى البحث"
                className="w-full rounded-full border border-ink-200 bg-ink-50 px-4 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full bg-ink-50 p-2.5 text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
              aria-label="بحث"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden border-b border-ink-100 bg-white lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center gap-7 py-3">
            <li>
              <button
                onClick={() => onCategoryClick('all')}
                className="nav-link font-bold text-brand-600"
              >
                الرئيسية
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => onCategoryClick(cat.id)} className="nav-link">
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-b border-ink-100 bg-white lg:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            <li>
              <button
                onClick={() => {
                  onCategoryClick('all');
                  setMenuOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2.5 text-right font-bold text-brand-600 hover:bg-brand-50"
              >
                الرئيسية
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    onCategoryClick(cat.id);
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-right text-ink-700 hover:bg-ink-50"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
