import { getArticleImageUrl } from '@/lib/editorial/image.mjs';

interface ArticleImageProps {
  src: string | null | undefined;
  alt: string;
  className: string;
}

export default function ArticleImage({ src, alt, className }: ArticleImageProps) {
  const imageUrl = getArticleImageUrl(src);

  if (imageUrl) {
    return <img src={imageUrl} alt={alt} className={className} />;
  }

  return (
    <div
      role="img"
      aria-label={`صورة افتراضية للمقال: ${alt}`}
      className={`article-image-placeholder ${className}`}
    >
      <span aria-hidden="true">P</span>
    </div>
  );
}
