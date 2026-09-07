import 'server-only';
import { sanityClient } from '@/lib/sanity/client';
import type { Article } from '@/lib/types';

const source = process.env.CONTENT_SOURCE;
if (source !== 'sanity') throw new Error(`Invalid CONTENT_SOURCE: ${source ?? 'missing'}. Supported value: sanity.`);

type PortableTextBlock = { children?: { text?: string }[] };
type SanityArticle = { _id: string; slug?: string; titleAr?: string; titleEn?: string; excerpt?: string; body?: PortableTextBlock[]; isFeatured?: boolean; isHotTopic?: boolean; commentsEnabled?: boolean; publishedAt?: string; author?: { name?: string; slug?: string }; category?: { slug?: string }; image?: { asset?: { url?: string }; alt?: string } };
const projection = `{_id,"slug":slug.current,titleAr,titleEn,excerpt,body,isFeatured,isHotTopic,commentsEnabled,publishedAt,"author":author->{name,"slug":slug.current},"category":category->{"slug":slug.current},"image":mainImage{alt,asset->{url}}}`;
const published = `_type == "article" && articleStatus == "published"`;
function text(body?: PortableTextBlock[]) { return (body ?? []).flatMap((block) => block.children ?? []).map((child) => child.text ?? '').join('\n'); }
function map(a: SanityArticle): Article { if (!a._id || !a.slug) throw new Error('Sanity article is missing its required permanent slug'); return { id: a._id, slug: a.slug, title: a.titleAr || a.titleEn || '', excerpt: a.excerpt ?? null, content: text(a.body), category: a.category?.slug || '', image_url: a.image?.asset?.url ?? null, author: a.author?.name || '', is_featured: Boolean(a.isFeatured), is_published: true, views: 0, read_time: null, created_at: a.publishedAt || '', updated_at: a.publishedAt || '', is_hot_topic: Boolean(a.isHotTopic), comments_enabled: Boolean(a.isHotTopic && a.commentsEnabled) }; }
export type EditorialFetcher = <T>(query: string, params?: Record<string, string>) => Promise<T>;
async function query<T>(q: string, p: Record<string, string> = {}) { try { return await sanityClient.fetch<T>(q, p, { next: { revalidate: 60, tags: ['sanity'] } }); } catch { throw new Error('Sanity editorial content is unavailable'); } }
export async function allArticles() { return (await query<SanityArticle[]>(`*[${published}] | order(publishedAt desc) ${projection}`)).map(map); }
export async function featuredArticle() { const a = await query<SanityArticle | null>(`*[${published} && isFeatured == true] | order(publishedAt desc)[0] ${projection}`); return a ? map(a) : null; }
export async function hotTopics() { return (await query<SanityArticle[]>(`*[${published} && isHotTopic == true] | order(publishedAt desc) ${projection}`)).map(map); }
export async function articleBySlug(slug: string) { const a = await query<SanityArticle | null>(`*[${published} && slug.current == $slug][0] ${projection}`, { slug }); return a ? map(a) : null; }
export async function categoryArticles(slug: string) { return (await query<SanityArticle[]>(`*[${published} && category->slug.current == $slug] | order(publishedAt desc) ${projection}`, { slug })).map(map); }
export async function authorArticles(slug: string) { return (await query<SanityArticle[]>(`*[${published} && author->slug.current == $slug] | order(publishedAt desc) ${projection}`, { slug })).map(map); }
export async function searchArticles(raw: string) { const q=raw.trim().replace(/[^\p{L}\p{N}\s-]/gu,'').slice(0,80); if (!q) return []; return (await query<SanityArticle[]>(`*[${published} && (titleAr match $q || titleEn match $q || excerpt match $q)] | order(publishedAt desc)[0...30] ${projection}`, { q: `*${q}*` })).map(map); }
export const editorialTestUtils = { map, sanitizeSearch: (raw: string) => raw.trim().replace(/[^\p{L}\p{N}\s-]/gu,'').slice(0,80), published };
