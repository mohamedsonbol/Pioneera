# Phase 1 Security Notes

## Implemented application safeguards

- `/admin` is a Server Component route and returns a not-found response unless the authenticated user has trusted `app_metadata.role = 'admin'` **and** their email is listed in `ADMIN_EMAILS`.
- The admin link was removed from the public header. The route is still available to explicitly configured administrators.
- New browser-side comment submission is disabled. The article UI is read-only and describes the planned member-comment workflow.
- `supabase/migrations/20260904000000_harden_legacy_access.sql` replaces permissive article, comment moderation, and newsletter administration policies with an `app_metadata`-based admin check. It also drops the anonymous comment insert policy.
- No service-role key is read by application code or included in `.env.example`. Public browser clients use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Authentication flows use Supabase PKCE callbacks, server-side code exchange, confirmed email status, password-reset links, and a safe relative redirect allowlist.

## Required deployment action

The hardening migration is a repository artifact only; it has not been run against Supabase. Before exposing this release, apply it through the normal Supabase migration workflow, then assign admin role claims using a trusted environment (Supabase dashboard or server-side Admin API) and set `ADMIN_EMAILS` on the deployment. Until that happens, existing remote RLS policies may remain permissive even though this UI no longer exposes their controls.

## Hardening migration review and local verification

`20260904000000_harden_legacy_access.sql` does not alter or delete rows. It leaves the existing `public_read_articles` policy in place, drops the anonymous comment insert policy, and replaces article mutations, comment moderation, and newsletter administration policies with `public.is_admin()` checks. The helper reads the signed JWT's `app_metadata.role`; application code has no service-role key and the browser cannot set that claim through normal Supabase user-update APIs.

The migration can be rolled back without data loss by dropping the restrictive named policies and restoring the previous policies from `20260829120434_create_pioneera_schema.sql`, then dropping `public.is_admin()` only after no policy references it. This rollback would deliberately restore the legacy vulnerability, so it must not be used in production except as an emergency, time-bounded recovery step.

No local Supabase environment is configured in this repository. Before remote application, verify in a disposable local project:

1. Apply the baseline and hardening migrations.
2. As `anon`, select a published article (allowed), attempt an article insert (denied), and attempt a comment insert (denied).
3. As a normal authenticated user, attempt article mutations, comment approval/deletion, and newsletter subscriber reads (all denied).
4. As a user whose trusted `app_metadata.role` is `admin`, repeat the administrative mutation/read checks (allowed).
5. Confirm existing articles, comments, and newsletter subscriber rows are unchanged after migration.

## Dependency advisories

`npm audit --omit=dev --json` on 2026-09-04 reported **zero production dependency vulnerabilities**. Full `npm audit --json` reported ten development/build-tool advisories: 2 low, 2 moderate, and 6 high. They are transitive dependencies of ESLint, Tailwind, Autoprefixer, and the React Hooks ESLint plugin: `@babel/core`, `@babel/helpers`, `brace-expansion`, `browserslist`, `flatted`, `glob`, `minimatch`, `picomatch`, `postcss-selector-parser`, and `yaml`.

No force upgrade was applied. These packages are not shipped as production runtime dependencies, but they execute in local or CI build tooling. Re-evaluate them when upstream releases compatible updates; do not use `npm audit fix --force` without a dedicated compatibility review.

## Remote images

The previous `next.config.ts` allowed every HTTP and HTTPS remote image host. No hostnames are hard-coded in the repository: article images are legacy `image_url` database values and all source UI images are local. The universal Next image allowlist was therefore removed. The current presentation retains native image elements for legacy database URLs; Phase 2 should inventory approved media hosts, migrate media to Sanity, then switch to `next/image` with an explicit hostname allowlist.

## Deferred comment policy

The final comment implementation must use a server-side route or Server Action and database policies to verify: authenticated user, confirmed email, active free subscription status, published article, and Sanity hot-topic designation. Inserts must default to pending moderation. It must not rely on client-side hiding of controls.
