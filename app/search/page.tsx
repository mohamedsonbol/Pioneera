import { createClient } from '@/lib/supabase/server';
import { fetchArticles, searchArticles } from '@/lib/queries';
import ArticleListingPage from '@/components/ArticleListingPage';

export const metadata = { title: 'البحث' };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const q = (await searchParams).q?.trim() ?? ''; const supabase = await createClient(); const [allArticles, articles] = await Promise.all([fetchArticles(supabase), q ? searchArticles(supabase, q) : Promise.resolve([])]); return <ArticleListingPage title={q ? `نتائج البحث عن: ${q}` : 'البحث'} description={q ? undefined : 'اكتبي عبارة البحث في شريط البحث أعلى الصفحة.'} articles={articles} allArticles={allArticles} />; }
