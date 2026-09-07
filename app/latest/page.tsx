import { allArticles } from '@/lib/editorial/repository';
import ArticleListingPage from '@/components/ArticleListingPage';

export const metadata = { title: 'أحدث المقالات' };
export default async function LatestPage() { const articles = await allArticles(); return <ArticleListingPage title="أحدث المقالات" articles={articles} allArticles={articles} />; }
