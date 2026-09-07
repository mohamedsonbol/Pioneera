import { allArticles, searchArticles } from '@/lib/editorial/repository';
import ArticleListingPage from '@/components/ArticleListingPage';

export const metadata = { title: 'البحث' };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const q = (await searchParams).q?.trim() ?? ''; const [all, articles] = await Promise.all([allArticles(), q ? searchArticles(q) : Promise.resolve([])]); return <ArticleListingPage title={q ? `نتائج البحث عن: ${q}` : 'البحث'} description={q ? undefined : 'اكتبي عبارة البحث في شريط البحث أعلى الصفحة.'} articles={articles} allArticles={all} />; }
