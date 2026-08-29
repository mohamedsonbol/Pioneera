import { useState, useEffect } from 'react';
import { fetchArticles, fetchFeaturedArticle } from '@/lib/queries';
import type { Article } from '@/lib/types';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featured, setFeatured] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchArticles(), fetchFeaturedArticle()])
      .then(([all, feat]) => {
        if (!mounted) return;
        setArticles(all);
        setFeatured(feat);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch articles:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { articles, featured, loading };
}
