import Image from 'next/image';
import { Instagram, Play } from 'lucide-react';
import { getSocialPosts, socialAccounts } from '@/lib/social';
import type { SocialPlatform } from '@/lib/social';
import TikTokIcon from '@/components/TikTokIcon';

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
