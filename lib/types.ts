export interface Article {
  id: string;
  slug?: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  content_html?: string | null;
  category: string;
  category_name?: string;
  image_url: string | null;
  author: string;
  author_slug?: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  read_time: string | null;
  created_at: string;
  updated_at: string;
  is_hot_topic?: boolean;
  comments_enabled?: boolean;
}

export interface Comment {
  id: string;
  article_id: string;
  name: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'fashion', name: 'أزياء', color: 'bg-brand-500', icon: 'Shirt' },
  { id: 'beauty', name: 'جمال', color: 'bg-accent-500', icon: 'Sparkles' },
  { id: 'health', name: 'صحة', color: 'bg-emerald-500', icon: 'Heart' },
  { id: 'family', name: 'سيدتي وطفلك', color: 'bg-sky-500', icon: 'Baby' },
  { id: 'food', name: 'مطبخ', color: 'bg-orange-500', icon: 'UtensilsCrossed' },
  { id: 'decor', name: 'منزل', color: 'bg-violet-500', icon: 'Home' },
  { id: 'stars', name: 'نجوم', color: 'bg-rose-500', icon: 'Star' },
  { id: 'video', name: 'فيديو', color: 'bg-ink-800', icon: 'Play' },
];

export function getCategoryColor(id: string): string {
  return categories.find((c) => c.id === id)?.color ?? 'bg-brand-500';
}

export function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? '';
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.id === slug);
}
