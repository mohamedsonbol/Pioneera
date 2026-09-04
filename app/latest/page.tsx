import { createClient } from '@/lib/supabase/server';
import { fetchArticles } from '@/lib/queries';
import ArticleListingPage from '@/components/ArticleListingPage';

export const metadata = { title: 'أحدث المقالات' };
export default async function LatestPage() { const articles = await fetchArticles(await createClient()); return <ArticleListingPage title="أحدث المقالات" articles={articles} allArticles={articles} />; }
