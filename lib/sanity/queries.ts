import { defineQuery } from 'next-sanity';
import { fetchSanity } from './client';

const articleProjection = `{
  _id, "slug": slug.current, titleAr, titleEn, excerpt, body, isFeatured, isHotTopic,
  commentsEnabled, publishedAt, seoTitle, seoDescription, canonicalUrl,
  "author": author->{name, "slug": slug.current},
  "category": category->{title, "slug": slug.current},
  "image": mainImage{alt, caption, asset->{url}}
}`;

export const homepageQuery = defineQuery(`{
  "featured": *[_type == "article" && articleStatus == "published" && isFeatured == true] | order(publishedAt desc)[0] ${articleProjection},
  "sections": *[_type == "homepageSection" && enabled == true] | order(_createdAt asc){title, key, "articles": articles[]-> ${articleProjection}}
}`);
export const latestArticlesQuery = defineQuery(`*[_type == "article" && articleStatus == "published"] | order(publishedAt desc) ${articleProjection}`);
export const hotTopicsQuery = defineQuery(`*[_type == "article" && articleStatus == "published" && isHotTopic == true] | order(publishedAt desc) ${articleProjection}`);
export const articleBySlugQuery = defineQuery(`*[_type == "article" && slug.current == $slug][0] ${articleProjection}`);
export const categoryBySlugQuery = defineQuery(`*[_type == "category" && slug.current == $slug][0]{title, "slug": slug.current, description, "articles": *[_type == "article" && articleStatus == "published" && category._ref == ^._id] | order(publishedAt desc) ${articleProjection}}`);
export const authorBySlugQuery = defineQuery(`*[_type == "author" && slug.current == $slug][0]{name, bio, "slug": slug.current, "articles": *[_type == "article" && articleStatus == "published" && author._ref == ^._id] | order(publishedAt desc) ${articleProjection}}`);
export const searchQuery = defineQuery(`*[_type == "article" && articleStatus == "published" && (titleAr match $term || titleEn match $term || excerpt match $term)] | order(publishedAt desc) ${articleProjection}`);
export const relatedArticlesQuery = defineQuery(`*[_type == "article" && articleStatus == "published" && category._ref == $categoryId && _id != $articleId] | order(publishedAt desc)[0...4] ${articleProjection}`);
export const sitemapEntriesQuery = defineQuery(`*[_type == "article" && articleStatus == "published"]{ "slug": slug.current, "updatedAt": _updatedAt }`);

export const sanityQueries = {
  homepage: () => fetchSanity<unknown>(homepageQuery),
  latest: () => fetchSanity<unknown[]>(latestArticlesQuery),
  hotTopics: () => fetchSanity<unknown[]>(hotTopicsQuery),
  articleBySlug: (slug: string) => fetchSanity<unknown>(articleBySlugQuery, { slug }),
  categoryBySlug: (slug: string) => fetchSanity<unknown>(categoryBySlugQuery, { slug }),
  authorBySlug: (slug: string) => fetchSanity<unknown>(authorBySlugQuery, { slug }),
  search: (term: string) => fetchSanity<unknown[]>(searchQuery, { term: `*${term}*` }),
  related: (articleId: string, categoryId: string) => fetchSanity<unknown[]>(relatedArticlesQuery, { articleId, categoryId }),
  sitemapEntries: () => fetchSanity<unknown[]>(sitemapEntriesQuery),
};
