import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

const enabled = process.env.PIONEERA_RUN_LOCAL_SUPABASE_REPLAY === '1';
const hasCli = (() => {
  try {
    execFileSync('supabase', ['--version'], { stdio: 'ignore' });
    execFileSync('psql', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();
const canRun = enabled && hasCli && existsSync('supabase/config.toml');

test('canonical active migrations replay on an isolated local Supabase database', { skip: canRun ? false : 'requires PIONEERA_RUN_LOCAL_SUPABASE_REPLAY=1, Supabase CLI, psql, and supabase/config.toml' }, () => {
  // --local is deliberate: this test must never accept a linked project or DB URL.
  execFileSync('supabase', ['start'], { stdio: 'inherit' });
  execFileSync('supabase', ['db', 'reset', '--local'], { stdio: 'inherit' });

  const query = [
    "select version from supabase_migrations.schema_migrations where version in ('20260829120434', '20260904000000', '20260907000000') order by version;",
    "select tablename, policyname from pg_policies where schemaname = 'public' and tablename in ('articles', 'comments', 'newsletter_subscribers') order by tablename, policyname;",
  ].join(' ');
  const output = execFileSync(
    'psql',
    ['postgresql://postgres:postgres@127.0.0.1:54322/postgres', '-At', '-c', query],
    { encoding: 'utf8' },
  );

  for (const version of ['20260829120434', '20260904000000', '20260907000000']) assert.match(output, new RegExp(version));
  for (const policy of ['public_read_articles', 'public_read_comments', 'public_subscribe_newsletter']) assert.match(output, new RegExp(policy));
  assert.doesNotMatch(output, /public_insert_comments/);
});
