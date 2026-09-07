import { allArticles, hotTopics } from '@/lib/editorial/repository';
import ArticleListingPage from '@/components/ArticleListingPage';

export const metadata = { title: 'المواضيع الساخنة' };
export default async function HotTopicsPage() { const [articles, hot] = await Promise.all([allArticles(), hotTopics()]); return <ArticleListingPage title="المواضيع الساخنة" description="أبرز الموضوعات وفق المقالات المميزة والأكثر مشاهدة حالياً." articles={hot} allArticles={articles} />; }
