import Image from 'next/image';
import { Instagram, Play } from 'lucide-react';
import { getSocialPosts, socialAccounts } from '@/lib/social';
import type { SocialPlatform } from '@/lib/social';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function PlatformBadge({ platform }: { platform: SocialPlatform }) {
  return (
    <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-ink-800 shadow-md">
      {platform === 'instagram' ? (
        <Instagram className="h-4 w-4 text-brand-600" aria-hidden="true" />
      ) : (
        <TikTokIcon className="h-4 w-4 text-ink-900" />
      )}
      <span className="sr-only">{platform === 'instagram' ? 'Instagram' : 'TikTok'}</span>
    </span>
  );
}

export default function SocialMediaSection() {
  const posts = getSocialPosts();

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-3 flex items-center gap-2">
          <Instagram className="h-6 w-6 text-brand-500" aria-hidden="true" />
          <TikTokIcon className="h-6 w-6 text-ink-900" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-7 w-1.5 rounded-full bg-brand-500" />
          <h2 className="font-serif text-xl font-bold text-ink-800 sm:text-2xl">
            تابع رحلتنا
          </h2>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
          ابقَ على تواصل مع Pioneera، واكتشف أحدث تحديثاتنا، وكن جزءًا من مجتمعنا المتنامي.
        </p>

        {posts.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl bg-ink-100 shadow-sm transition-all duration-300 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <Image
                  src={post.thumbnail}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {post.platform === 'tiktok' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/60 shadow-md transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </span>
                  </span>
                )}
                <PlatformBadge platform={post.platform} />
              </a>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={socialAccounts.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            تابعنا على إنستغرام
          </a>
          <a
            href={socialAccounts.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-500"
          >
            <TikTokIcon className="h-4 w-4" />
            تابعنا على تيك توك
          </a>
        </div>
      </div>
    </section>
  );
}
