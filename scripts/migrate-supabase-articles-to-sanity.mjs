#!/usr/bin/env node
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createSanityClient } from '@sanity/client';

const apply = process.argv.includes('--apply');
const env = (name) => process.env[name];
const imageAssetMap = JSON.parse(env('SANITY_IMAGE_ASSET_MAP_JSON') || '{}');
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SANITY_PROJECT_ID', 'SANITY_DATASET', 'SANITY_API_TOKEN'];
const missing = required.filter((name) => !env(name));
if (missing.length) throw new Error(`Missing required migration variables: ${missing.join(', ')}`);
if (apply && env('MIGRATION_CONFIRM') !== 'YES') throw new Error('Refusing write: pass --apply with MIGRATION_CONFIRM=YES.');

const slugify = (value) => value.trim().toLowerCase().replace(/[^\w\u0600-\u06ff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'article';
const supabase = createSupabaseClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
const sanity = createSanityClient({ projectId: env('SANITY_PROJECT_ID'), dataset: env('SANITY_DATASET'), apiVersion: '2026-09-04', token: env('SANITY_API_TOKEN'), useCdn: false });
const { data: articles, error } = await supabase.from('articles').select('*').order('created_at');
if (error) throw error;

const report = { total: articles.length, ready: 0, skipped: [] };
for (const item of articles) {
  const issues = ['title', 'excerpt', 'content', 'author', 'category', 'image_url'].filter((field) => !item[field]);
  if (item.image_url && !imageAssetMap[item.image_url]) issues.push('image_url has no Sanity asset mapping');
  if (issues.length) { report.skipped.push({ id: item.id, issues }); continue; }
  report.ready += 1;
  const authorId = `legacy.author.${slugify(item.author)}`;
  const categoryId = `legacy.category.${slugify(item.category)}`;
  const articleId = `legacy.article.${item.id}`;
  const document = {
    _id: articleId, _type: 'article', legacyId: item.id, titleAr: item.title,
    slug: { _type: 'slug', current: `${slugify(item.title)}-${item.id.slice(0, 8)}` }, excerpt: item.excerpt,
    body: [{ _type: 'block', _key: 'legacy', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'legacy', marks: [], text: item.content }] }],
    mainImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetMap[item.image_url] }, alt: item.title }, author: { _type: 'reference', _ref: authorId }, category: { _type: 'reference', _ref: categoryId },
    isFeatured: item.is_featured, isHotTopic: false, commentsEnabled: false, publishedAt: item.created_at,
    articleStatus: item.is_published ? 'published' : 'draft',
  };
  if (apply) await sanity.transaction().createOrReplace({ _id: authorId, _type: 'author', name: item.author, slug: { _type: 'slug', current: slugify(item.author) } }).createOrReplace({ _id: categoryId, _type: 'category', title: item.category, slug: { _type: 'slug', current: slugify(item.category) } }).createOrReplace(document).commit();
}
console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...report }, null, 2));
