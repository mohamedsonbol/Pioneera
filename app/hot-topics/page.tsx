import { createClient } from '@/lib/supabase/server';
import { fetchArticles } from '@/lib/queries';
import ArticleListingPage from '@/components/ArticleListingPage';

export const metadata = { title: 'المواضيع الساخنة' };
export default async function HotTopicsPage() { const articles = await fetchArticles(await createClient()); const hot = [...articles].sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || b.views - a.views); return <ArticleListingPage title="المواضيع الساخنة" description="أبرز الموضوعات وفق المقالات المميزة والأكثر مشاهدة حالياً." articles={hot} allArticles={articles} />; }
