export type SocialPlatform = 'instagram' | 'tiktok';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  url: string;
  thumbnail: string;
  alt: string;
}

export const socialAccounts: Record<SocialPlatform, string> = {
  instagram: 'https://www.instagram.com/pioneerawomen/',
  tiktok: 'https://www.tiktok.com/@paioneera',
};

export const socialPosts: SocialPost[] = [];

export function getSocialPosts(): SocialPost[] {
  return socialPosts.filter((post) => post.url && post.thumbnail);
}
