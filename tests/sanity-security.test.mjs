import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { hasValidSecret, safeRelativePath } from '../lib/sanity/security.mjs';

test('preview and webhook secret comparison rejects absent and unequal values', () => {
  assert.equal(hasValidSecret(null, 'secret'), false);
  assert.equal(hasValidSecret('wrong', 'secret'), false);
  assert.equal(hasValidSecret('secret', 'secret'), true);
});

test('redirect paths remain relative to the application', () => {
  assert.equal(safeRelativePath('/article/test'), '/article/test');
  assert.equal(safeRelativePath('//attacker.example'), '/');
  assert.equal(safeRelativePath('https://attacker.example'), '/');
});

test('article schema contains the Phase 2A editorial safeguards', async () => {
  const schema = await readFile(new URL('../sanity/schemaTypes/article.ts', import.meta.url), 'utf8');
  for (const field of ['isHotTopic', 'commentsEnabled', 'articleStatus', 'legacyId', 'publishedAt']) assert.match(schema, new RegExp(field));
  assert.match(schema, /لا يمكن تفعيل التعليقات إلا للموضوعات الساخنة/);
  assert.match(schema, /المقال المنشور يحتاج/);
});

test('importer is dry-run by default and requires two explicit write guards', async () => {
  const script = await readFile(new URL('../scripts/migrate-supabase-articles-to-sanity.mjs', import.meta.url), 'utf8');
  assert.match(script, /process\.argv\.includes\('--apply'\)/);
  assert.match(script, /MIGRATION_CONFIRM/);
  assert.match(script, /legacyId/);
});

test('the embedded Studio is unavailable in production while its runtime advisories remain open', async () => {
  const proxy = await readFile(new URL('../proxy.ts', import.meta.url), 'utf8');
  assert.match(proxy, /NODE_ENV === 'production'/);
  assert.match(proxy, /pathname\.startsWith\('\/studio'\)/);
  assert.match(proxy, /new NextResponse\('Not found', \{ status: 404 \}\)/);
});
