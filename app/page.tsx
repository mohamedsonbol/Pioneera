import { createClient } from '@/lib/supabase/server';
import { fetchArticles, fetchFeaturedArticle } from '@/lib/queries';
import HomePage from '@/components/HomePage';

export default async function Page() {
  const supabase = await createClient();
  const [articles, featured] = await Promise.all([
    fetchArticles(supabase),
    fetchFeaturedArticle(supabase),
  ]);

  return <HomePage articles={articles} featured={featured} />;
}
