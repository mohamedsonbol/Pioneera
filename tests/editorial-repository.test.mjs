import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeArticle, sanitizeSearch } from '../lib/editorial/normalization.mjs';
import { readFile } from 'node:fs/promises';

const base = { _id: 'a', slug: 'stable-slug', titleAr: 'عنوان', articleStatus: 'published', publishedAt: '2026-01-01', category: { slug: 'beauty' }, author: { name: 'كاتبة', slug: 'writer' }, isHotTopic: true, commentsEnabled: true, body: [{ children: [{ text: 'نص' }] }] };
test('normalizes permanent Sanity slugs and comment invariant', () => { const article = normalizeArticle(base); assert.equal(article.id, 'a'); assert.equal(article.is_hot_topic, true); assert.equal(article.comments_enabled, true); assert.equal(article.content, 'نص'); assert.equal(normalizeArticle({ ...base, isHotTopic: false, commentsEnabled: true }).comments_enabled, false); });
test('search is bounded and sanitised', () => { const value = sanitizeSearch('  <script>' + 'أ'.repeat(100) + '</script> '); assert.ok(value.length <= 80); assert.doesNotMatch(value, /[<>]/); });
test('fixture references retain category and author slugs', () => { const article = normalizeArticle(base); assert.equal(article.category, 'beauty'); assert.equal(article.author, 'كاتبة'); });
test('Sanity fixture cards retain canonical slugs without UUID derivation', () => { assert.equal(normalizeArticle(base).slug, 'stable-slug'); });
test('repository rejects unsupported source and converts Sanity failures to a controlled error', async () => { const source = await readFile(new URL('../lib/editorial/repository.ts', import.meta.url), 'utf8'); assert.match(source, /source !== 'sanity'/); assert.match(source, /Invalid CONTENT_SOURCE/); assert.match(source, /Sanity editorial content is unavailable/); });
test('converted editorial routes and article presentation have no Supabase editorial dependency', async () => { for (const path of ['../app/page.tsx','../app/latest/page.tsx','../app/hot-topics/page.tsx','../app/search/page.tsx','../app/article/[slug]/page.tsx','../app/category/[slug]/page.tsx','../app/author/[slug]/page.tsx','../components/ArticleDetail.tsx']) { const source = await readFile(new URL(path, import.meta.url), 'utf8'); assert.doesNotMatch(source, /fetchArticles|fetchComments|incrementView|lib\/supabase/); } });
