import { allArticles, featuredArticle } from '@/lib/editorial/repository';
import HomePage from '@/components/HomePage';

export default async function Page() {
  const [articles, featured] = await Promise.all([allArticles(), featuredArticle()]);

  return <HomePage articles={articles} featured={featured} />;
}
