# Supabase migration history and deployment workflow

## Canonical active chain

The active migration directory is replayable on an empty database. Do not apply it to a remote project without the environment-specific approval and history checks below.

Filename-order behavior is:

1. `20260829120434_create_pioneera_schema.sql` creates the three tables with hardened policies.
2. `20260904000000_harden_legacy_access.sql` is an idempotent transition for legacy schemas.
3. `20260907000000_secure_development_bootstrap.sql` asserts the schema and policy posture without changing application objects.

Use `supabase db push`; it records history and avoids direct-psql drift.

## Recommended canonical layout — pending approval

Use one active, CLI-compatible chain in `supabase/migrations/`:

1. `20260829120434_create_pioneera_schema.sql` becomes a **secure baseline**: it creates the original tables, indexes, constraints, trigger, `public.is_admin()`, and hardened RLS in one migration. It must never create permissive authenticated-admin or anonymous-comment policies.
2. `20260904000000_harden_legacy_access.sql` remains an idempotent transition for databases whose first migration was the legacy schema. It should be safe after the secure baseline, producing the same final policies.
3. `20260907000000_secure_development_bootstrap.sql` is replaced with a compatible schema/policy assertion or removed from the active chain before any remote has recorded it. It must not create duplicate tables or demand an empty database.

Keep an immutable copy of the current legacy first migration outside the active CLI directory, for example:

```text
supabase/archive/20260829120434_create_pioneera_schema.legacy-permissive.sql
supabase/archive/20260907000000_secure_development_bootstrap.superseded.sql
```

The archive is for audit only; Supabase CLI must not read it as migrations. Git history also retains the original files. Moving or rewriting an active migration is a deployment-sensitive Git change: branches checked out before the change must never be used to initialize a new environment after the canonical chain is adopted. Review and commit the archive move and active-chain rewrite atomically.

## Empty development, staging, and disaster-recovery environments

After the canonical chain is approved and committed, use the normal CLI workflow. Verify the intended project first, then preview and push:

```bash
supabase migration list --db-url "$PIONEERA_ENVIRONMENT_DB_URL"
supabase db push --dry-run --db-url "$PIONEERA_ENVIRONMENT_DB_URL"
supabase db push --db-url "$PIONEERA_ENVIRONMENT_DB_URL"
```

Expected history after a successful empty-environment push:

```text
20260829120434
20260904000000
20260907000000
```

`db push` creates `supabase_migrations.schema_migrations` when needed and records each applied version. Future pushes compare the active directory with that history and run only later migrations. For disaster recovery, create an empty replacement project, restore required data from backup, then run this same migration-list/dry-run/push sequence against the replacement project's database URL. Do not use `supabase db reset --linked`.

## Existing legacy environments

Before changing anything, capture the real schema and history:

```bash
supabase migration list --db-url "$LEGACY_ENVIRONMENT_DB_URL"
```

If version `20260829120434` is recorded and `20260904000000` is absent, the normal transition command after approval is:

```bash
supabase db push --dry-run --db-url "$LEGACY_ENVIRONMENT_DB_URL"
supabase db push --db-url "$LEGACY_ENVIRONMENT_DB_URL"
```

It must show and apply only `20260904000000_harden_legacy_access.sql`; the resulting history is:

```text
20260829120434
20260904000000
20260907000000
```

The final entry is only appropriate after migration 3 has been converted to a compatible assertion/no-op and is reviewed as safe for that database. If the schema and history differ, stop. Use `supabase db pull` to capture verified drift, or use the supported `supabase migration repair --status applied|reverted <version>` only after proving the exact schema state. Repair changes history only; it never applies or reverts SQL.

## Local replay test

The canonical chain must be tested in a disposable local Supabase/Postgres database before approval. The test environment needs the Supabase CLI and `psql`, neither of which is available in this workspace. Once installed, the test must:

1. Start an isolated local stack.
2. Replay the active `supabase/migrations/` chain against an empty database.
3. Assert the three history versions are recorded.
4. Assert all target tables have RLS, no `public_insert_comments` policy exists, and the expected admin/public policies exist.
5. Tear down the local stack only; it must never use `--linked` or any remote database URL.

Until the chain is changed, this test is expected to expose the migration-3 guard conflict rather than pass.

## Rollback implications

Do not roll back a baseline by dropping tables in a shared environment. Roll forward with a new corrective migration. The existing legacy hardening rollback is policy-only and intentionally restores insecure authorization, so it requires an approved incident and immediate corrective deployment. A disaster-recovery rebuild uses the canonical replay plus backup restoration, not migration-history edits.
