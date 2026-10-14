import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { getSupabaseConfig, isSupabaseConfigured } from '../lib/supabase/config.mjs';

test('missing public Supabase variables resolve to an unavailable configuration', () => {
  const absent = { NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: '' };
  assert.equal(getSupabaseConfig(absent), null);
  assert.equal(isSupabaseConfigured(absent), false);
  assert.deepEqual(getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key' }), {
    url: 'https://project.supabase.co', key: 'anon-key',
  });
});

test('public auth initializes Supabase only when configured and otherwise settles signed out', async () => {
  const [client, auth, layout] = await Promise.all([
    readFile(new URL('../lib/supabase/client.ts', import.meta.url), 'utf8'),
    readFile(new URL('../lib/auth.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(client, /if \(!config\) return null;/);
  assert.match(auth, /const \[loading, setLoading\] = useState\(available\)/);
  assert.match(auth, /const \[session, setSession\] = useState<Session \| null>\(null\)/);
  assert.match(auth, /if \(!available\) \{\s*return;/);
  assert.match(auth, /user: session\?\.user \?\? null/);
  assert.match(layout, /<AuthProvider>/);
  assert.doesNotMatch(layout, /createClient|supabase/i);
});

test('public pages stay on the WordPress repository and membership URLs have controlled fallbacks', async () => {
  const paths = ['../app/page.tsx', '../app/latest/page.tsx', '../app/hot-topics/page.tsx', '../app/search/page.tsx'];
  for (const path of paths) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /lib\/editorial\/repository/);
    assert.doesNotMatch(source, /supabase/i);
  }
  const [form, header, account, callback] = await Promise.all([
    readFile(new URL('../components/AuthForm.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/Header.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/account/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/auth/callback/route.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(form, /if \(!available\)/);
  assert.match(form, /العضوية غير متاحة حالياً/);
  assert.match(header, /\{available && \(/);
  assert.match(header, /href="\/account"/);
  assert.match(account, /if \(!isSupabaseConfigured\(\)\)/);
  assert.match(callback, /if \(!isSupabaseConfigured\(\)\)/);
});

test('admin delegates to WordPress and proxy bypasses Supabase when unconfigured', async () => {
  const [admin, proxy] = await Promise.all([
    readFile(new URL('../app/admin/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../proxy.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(admin, /redirect\('https:\/\/cms\.pioneera\.net\/wp-admin'\)/);
  assert.doesNotMatch(admin, /supabase/i);
  assert.match(proxy, /if \(!url \|\| !key\) return supabaseResponse;/);
});
