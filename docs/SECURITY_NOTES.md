# Phase 1 Security Notes

## Implemented application safeguards

- `/admin` is a Server Component route and returns a not-found response unless the authenticated user has trusted `app_metadata.role = 'admin'` **and** their email is listed in `ADMIN_EMAILS`.
- The admin link was removed from the public header. The route is still available to explicitly configured administrators.
- New browser-side comment submission is disabled. The article UI is read-only and describes the planned member-comment workflow.
- The canonical active migration baseline creates hardened policies from the outset. The former permissive baseline is retained only under `supabase/archive/` for audit; `20260904000000_harden_legacy_access.sql` remains the idempotent transition for legacy databases.
- No service-role key is read by application code or included in `.env.example`. Public browser clients use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Authentication flows use Supabase PKCE callbacks, server-side code exchange, confirmed email status, password-reset links, and a safe relative redirect allowlist.

## Required deployment action

The hardening migration is a repository artifact only; it has not been run against Supabase. Before exposing this release, apply it through the normal Supabase migration workflow, then assign admin role claims using a trusted environment (Supabase dashboard or server-side Admin API) and set `ADMIN_EMAILS` on the deployment. Until that happens, existing remote RLS policies may remain permissive even though this UI no longer exposes their controls.

## Canonical migration review and local verification

Never use `supabase db reset --linked`. Empty local, development, staging, and disaster-recovery databases must replay the active chain with the CLI; existing legacy databases first receive the hardening transition. Older repository checkouts must be retired before the canonical baseline rewrite is deployed. Corrections are forward-only migrations, not destructive baseline rollbacks.

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

After adding Sanity 6.12.0, the initial Studio graph introduced twelve runtime audit findings. `styled-components` was safely upgraded from 6.1.19 to 6.5.3 after peer-compatibility verification with React 19.2.8 and Sanity 6.12.0; that removes the nested PostCSS finding. The 2026-09-04 audit now reports **10 runtime findings (8 moderate, 2 high)** and **15 findings overall (1 low, 8 moderate, 6 high)**. The other five are development/build-only: `brace-expansion`, `flatted`, `glob`, `minimatch`, and `postcss-selector-parser` through ESLint/Tailwind tooling.

The following is the individual runtime assessment. The audit's only proposed top-level changes are downgrades to `sanity@5.14.1` or `next-sanity@11.6.13`, which are incompatible with the selected Next.js 16 / React 19 baseline. No `npm audit fix` command was used.

| Package / advisory | Installed dependency path and scope | Patched version / safe mitigation |
|---|---|---|
| `sanity` (parent advisory) | Direct `sanity@6.12.0`; embeds the Studio and its CLI. Not used by public Supabase article pages in shadow mode. | Audit suggests incompatible downgrade to 5.14.1. Keep 6.12.0 and block `/studio` in production pending a supported upstream fix. |
| `next-sanity` (parent advisory) | Direct `next-sanity@13.3.4`; Studio/preview integration. | Audit suggests incompatible downgrade to 11.6.13. No safe upgrade reported; production Studio block applies. |
| `@sanity/cli` (parent advisory) | `sanity@6.12.0 -> @sanity/cli@8.9.1`; Studio CLI only. | Affected through CLI dependencies; no compatible fix in the installed supported tree. Use only trusted local/CI input. |
| `@sanity/cli-build` (parent advisory) | `sanity -> @sanity/cli -> @sanity/cli-build@6.3.0`; Studio build tooling. | No compatible fix reported; production Studio block applies. |
| `@vercel/frameworks` (parent advisory) | `sanity -> @sanity/cli -> @vercel/frameworks`; CLI framework detection. | Its child findings require an upstream CLI update; no compatible override validated. |
| `js-yaml` — GHSA-mh29-5h37-fv8m, GHSA-h67p-54hq-rp68, GHSA-52cp-r559-cp3m, GHSA-5p4m-2wfm-xmqj | `sanity -> @sanity/cli -> @vercel/frameworks -> js-yaml@3.15.0`; Studio CLI only. | Requires >=3.15.1 for all listed findings, but the parent has not supplied it. Do not process untrusted Studio CLI configuration; wait for upstream. |
| `smol-toml` — GHSA-v3rj-xjv7-4jmq | `sanity -> @sanity/cli -> @vercel/frameworks -> smol-toml`; Studio CLI only. | Fixed in >=1.6.1; parent update required. No direct override used. |
| `typeid-js` (parent advisory) | `sanity -> @sanity/cli -> typeid-js`; Studio CLI only. | Vulnerable because of its nested UUID; upstream update required. |
| `uuid` — GHSA-w5hq-g745-h8pq | `sanity -> @sanity/cli -> typeid-js -> uuid@10`; Studio CLI only. | Fixed in >=11.1.1; no compatible parent update reported. |
| `picomatch` — GHSA-3v7f-55p6-f55p, GHSA-c2c7-rcm5-vvqj | `sanity -> @sanity/cli -> @sanity/codegen -> chokidar -> anymatch -> picomatch@2.3.1`; also present in watcher/build tooling. | A patched release exists, but no compatible parent resolution was validated. Avoid untrusted glob input and keep the Studio production block. |

The production proxy returns 404 for `/studio` whenever `NODE_ENV=production`. This is intentional and must remain until a fresh runtime audit is clean or each applicable upstream advisory is remediated by compatible releases.

## Node.js baseline and validation (2026-09-05)

Production and local validation use Node **22.23.1** (the supported range is `>=22.23.1 <23`, enforced in `package.json`; `.nvmrc` pins 22.23.1). Select it with `nvm use` before installing or running the application. Node 24 is not a supported production baseline.

The prior Node 24.18.0 validation failed during `next build`: Turbopack reported an OS `Operation not permitted` error while processing `@portabletext/plugin-table` CSS and attempting to create a helper process/bind a port. A webpack fallback also encountered Next's TypeScript `--showConfig` output parsing failure. No CSS, security control, or Studio route was removed to bypass either issue.

Under Node 22.23.1 with npm 10.9.8, `npm ci`, lint, TypeScript checking, all five tests, `next build`, and the read-only migration verifier passed. The production build used Next 16.3.3 with Turbopack and compiled the embedded Studio route successfully. `npm audit --omit=dev` still reports 10 findings (8 moderate, 2 high), exactly the unresolved Studio/CLI dependency graph documented above.

Loopback route checks under Node 22 confirmed `/studio` returns 200 in development and 404 from a production `next start` server; draft-mode and revalidation endpoints return 401 for absent or invalid secrets. A scan of production client JavaScript found no `SANITY_PREVIEW_SECRET`, `SANITY_REVALIDATE_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, or `service_role` identifiers.

The validation shell did not receive a local `.env*` file or the configured Supabase/Sanity variables, so it could verify route status and rejection paths but could not perform an authenticated, credential-backed homepage or Studio data smoke test. Repeat that final smoke test in the deployment-like environment where those variables are supplied; never print their values.

## Sanity preview and webhook secrets

`SANITY_PREVIEW_SECRET` authorizes draft-mode entry and `SANITY_REVALIDATE_SECRET` authorizes webhook cache invalidation. Both are server-only values. The endpoints reject missing or incorrect secrets using constant-time comparison; webhook requests may invalidate only the shared `sanity` tag and a safe relative path.

## Remote images

The previous `next.config.ts` allowed every HTTP and HTTPS remote image host. No hostnames are hard-coded in the repository: article images are legacy `image_url` database values and all source UI images are local. The universal Next image allowlist was therefore removed. The current presentation retains native image elements for legacy database URLs; Phase 2 should inventory approved media hosts, migrate media to Sanity, then switch to `next/image` with an explicit hostname allowlist.

## Deferred comment policy

The final comment implementation must use a server-side route or Server Action and database policies to verify: authenticated user, confirmed email, active free subscription status, published article, and Sanity hot-topic designation. Inserts must default to pending moderation. It must not rely on client-side hiding of controls.
## Sanity development boundary

Use only `CONTENT_SOURCE=sanity` with the development dataset during Phase 2B. Empty results are intentional; failures are controlled server errors, never Supabase editorial fallback. Production Studio remains blocked. The unresolved Sanity/Studio audit findings remain a production-release risk. Development fixture instructions are in `SANITY_DEVELOPMENT_FIXTURES.md`.
