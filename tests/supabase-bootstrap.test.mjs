import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migrationUrl = new URL('../supabase/migrations/20260829120434_create_pioneera_schema.sql', import.meta.url);
const archiveUrl = new URL('../supabase/archive/20260829120434_create_pioneera_schema.legacy-permissive.sql', import.meta.url);

test('secure baseline creates the required schema on an empty target', async () => {
  const sql = await readFile(migrationUrl, 'utf8');
  for (const table of ['articles', 'comments', 'newsletter_subscribers']) {
    assert.match(sql, new RegExp(`CREATE TABLE public\\.${table}`));
  }
  assert.match(sql, /REFERENCES public\.articles\(id\) ON DELETE CASCADE/);
  assert.match(sql, /CREATE TRIGGER articles_set_updated_at/);
  assert.match(sql, /CREATE UNIQUE INDEX newsletter_subscribers_email_lower_key/);
});

test('secure baseline starts with hardened RLS policies', async () => {
  const sql = await readFile(migrationUrl, 'utf8');
  for (const table of ['articles', 'comments', 'newsletter_subscribers']) {
    assert.match(sql, new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`));
    assert.match(sql, new RegExp(`ALTER TABLE public\\.${table} FORCE ROW LEVEL SECURITY`));
  }
  assert.match(sql, /auth\.jwt\(\) -> 'app_metadata' ->> 'role'/);
  assert.match(sql, /CREATE POLICY public_read_articles[\s\S]*is_published = true/);
  assert.match(sql, /CREATE POLICY public_read_comments[\s\S]*is_approved = true/);
  assert.match(sql, /CREATE POLICY public_subscribe_newsletter/);
  assert.doesNotMatch(sql, /public_insert_comments/);
  assert.doesNotMatch(sql, /WITH CHECK \(true\).*comments/);
});

test('legacy permissive SQL is retained only as an audit archive', async () => {
  const sql = await readFile(archiveUrl, 'utf8');
  assert.match(sql, /public_insert_comments/);
  assert.match(sql, /WITH CHECK \(true\)/);
});
