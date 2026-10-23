import Image from 'next/image';
import { ArrowUpLeft } from 'lucide-react';

type SonbolLabsAdSettings = {
  destination: string;
  brand: string;
  description: string;
  callToAction: string;
  accessibleLabel: string;
  image: { src: string; alt: string } | null;
};

// Keep the campaign content in one place so its destination, copy, or optional
// approved creative can be changed without touching the header layout.
export const sonbolLabsAd: SonbolLabsAdSettings = {
  destination: 'https://sonbolabs.exceptionalgrp.com',
  brand: 'SONBOL LABS',
  description: 'منتجات رقمية وتجارة إلكترونية وذكاء اصطناعي.',
  callToAction: 'ابدأ مشروعك',
  accessibleLabel: 'إعلان: تعرّف إلى Sonbol Labs وابدأ مشروعك',
  image: null,
};

interface SonbolLabsAdProps {
  compact?: boolean;
}

export default function SonbolLabsAd({ compact = false }: SonbolLabsAdProps) {
  const { destination, brand, description, callToAction, accessibleLabel, image } = sonbolLabsAd;

  return (
    <a
      href={destination}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={accessibleLabel}
      className={`group relative flex w-full items-center overflow-hidden border border-[#3c453f] bg-[#111513] text-[#f4f5f1] outline-none focus-visible:ring-2 focus-visible:ring-[#9be64a] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        compact ? 'min-h-[58px] px-3 py-2.5' : 'min-h-[72px] px-4 py-3'
      }`}
    >
      <span className="absolute left-0 top-0 border-b border-r border-[#3c453f] bg-[#f4f5f1] px-1.5 py-0.5 text-[9px] font-bold leading-none text-[#111513]">
        إعلان
      </span>
      <span className="absolute -left-6 bottom-0 h-12 w-24 -rotate-12 border-t border-[#9be64a]/70" aria-hidden="true" />
      <span className={`relative flex min-w-0 flex-1 items-center ${compact ? 'gap-2.5' : 'gap-3.5'}`}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 object-contain"
          />
        ) : (
          <span
            dir="ltr"
            className={`shrink-0 font-black tracking-[0.12em] text-[#9be64a] ${compact ? 'text-[10px]' : 'text-xs'}`}
          >
            {brand}
          </span>
        )}
        <span className={`min-w-0 font-medium leading-snug text-[#dce2dc] ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </span>
      </span>
      <span className={`relative ms-3 inline-flex shrink-0 items-center gap-1 border border-[#9be64a] px-2 py-1.5 font-bold text-[#9be64a] transition-colors group-hover:bg-[#9be64a] group-hover:text-[#111513] ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {callToAction}
        <ArrowUpLeft className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </a>
  );
}
