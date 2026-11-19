'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Clock, UserRound, Phone, MessageCircle, Instagram } from 'lucide-react';
import { categories } from '@/lib/types';
import type { Article } from '@/lib/types';
import { getCategoryName } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import ArticleImage from '@/components/ArticleImage';
import SonbolLabsAd from '@/components/SonbolLabsAd';
import TikTokIcon from '@/components/TikTokIcon';
import { socialAccounts } from '@/lib/social';

interface HeaderProps {
  articles: Article[];
}

export default function Header({ articles }: HeaderProps) {
  const router = useRouter();
  const { available } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const searchResults = searchQuery.trim()
    ? articles
        .filter(
          (a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50">
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
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="tel:+971556889166"
              dir="ltr"
              className="flex items-center gap-1.5 text-ink-300 transition-colors hover:text-brand-400"
              aria-label="اتصل بنا على +971 55 688 9166"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+971 55 688 9166</span>
            </a>
            <a
              href="https://wa.me/971556889166"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-ink-300 transition-colors hover:text-brand-400"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>واتساب</span>
            </a>
            <a
              href={socialAccounts.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-ink-300 transition-colors hover:text-brand-400"
              aria-label="إنستغرام Pioneera"
              title="إنستغرام"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a
              href={socialAccounts.tiktok}
              target="_blank"
              rel="noreferrer"
              className="text-ink-300 transition-colors hover:text-brand-400"
              aria-label="تيك توك Pioneera"
              title="تيك توك"
            >
              <TikTokIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="tel:00201032907200"
              dir="ltr"
              className="flex items-center gap-1.5 text-ink-300 transition-colors hover:text-brand-400"
              aria-label="اتصل بنا على 00201032907200"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>00201032907200</span>
            </a>
          </div>
        </div>
      </div>

      <div className={`bg-white shadow-sm transition-all duration-300 ${scrolled ? 'py-2' : 'py-2.5 sm:py-3'}`}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between gap-3 lg:gap-5">
            <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="text-ink-700 transition-colors hover:text-brand-600 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="القائمة"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link
              href="/"
              aria-label="Pioneera - الرئيسية"
              className={`relative block aspect-[1030/460] shrink-0 overflow-hidden rounded-sm transition-[width] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${
                scrolled ? 'w-[125px] sm:w-[145px] lg:w-[165px]' : 'w-[140px] sm:w-[165px] lg:w-[185px]'
              }`}
            >
              <Image
                src="/IMG-20260828-WA0007.jpg"
                alt="Pioneera logo"
                width={1536}
                height={1024}
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 165px, 185px"
                className="pointer-events-none absolute -left-[22.82%] -top-[61.96%] h-auto w-[149.13%] max-w-none mix-blend-multiply"
              />
            </Link>
            </div>

            <div className="hidden min-w-0 flex-1 lg:block lg:max-w-[570px]">
              <SonbolLabsAd />
            </div>

            <div className="flex shrink-0 items-center gap-3">
            <div className="relative">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  searchOpen ? 'w-48 sm:w-64' : 'w-0'
                }`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="اكتب الكلمات الرئيسية فى البحث"
                  className="w-full rounded-full border border-ink-200 bg-ink-50 px-4 py-2 text-sm outline-none focus:border-brand-400"
                />
              </div>
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 top-12 z-50 w-80 max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-xl">
                  {searchResults.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => {
                        router.push(`/article/${article.slug!}`);
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      className="flex w-full items-center gap-3 border-b border-ink-50 px-4 py-3 text-right transition-colors hover:bg-ink-50"
                    >
                      <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded">
                        <ArticleImage
                          src={article.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-ink-700">
                          {article.title}
                        </p>
                        <p className="text-xs text-ink-400">
                          {getCategoryName(article.category)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (searchOpen && searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                  return;
                }
                setSearchOpen(!searchOpen);
              }}
              className="rounded-full bg-ink-50 p-2.5 text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
              aria-label="بحث"
            >
              <Search className="h-5 w-5" />
            </button>
            {available && (
              <Link
                href="/account"
                className="rounded-full bg-ink-50 p-2.5 text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                aria-label="الحساب"
                title="الحساب"
              >
                <UserRound className="h-5 w-5" />
              </Link>
            )}
            </div>
          </div>
          <div className="mt-2 lg:hidden">
            <SonbolLabsAd compact />
          </div>
        </div>
      </div>

      <nav className="hidden border-b border-ink-100 bg-white lg:block">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center gap-7 py-3">
            <li>
              <Link href="/" className="nav-link font-bold text-brand-600">
                الرئيسية
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.id}`} className="nav-link">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-b border-ink-100 bg-white lg:hidden">
          <ul id="mobile-navigation" className="flex flex-col gap-1 px-4 py-3">
            <li>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-lg px-3 py-2.5 text-right font-bold text-brand-600 hover:bg-brand-50"
              >
                الرئيسية
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-lg px-3 py-2.5 text-right text-ink-700 hover:bg-ink-50"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-ink-100 pt-2">
              <a
                href="tel:+971556889166"
                dir="ltr"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-ink-700 hover:bg-ink-50"
              >
                <Phone className="h-4 w-4 text-brand-600" />
                <span>+971 55 688 9166</span>
              </a>
            </li>
            <li>
              <a
                href="tel:00201032907200"
                dir="ltr"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-right text-ink-700 hover:bg-ink-50"
              >
                <Phone className="h-4 w-4 text-brand-600" />
                <span>00201032907200</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/971556889166"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50"
              >
                <MessageCircle className="h-4 w-4 text-brand-600" />
                <span>واتساب</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
