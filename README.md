# Pioneera.net — Next.js

Arabic RTL digital magazine built with Next.js App Router, Tailwind CSS, Supabase, and a Sanity Studio operating in Phase 2A shadow mode. Supabase remains the live article source.

## Setup

1. Select the supported Node.js baseline. The project requires Node 22.23.1 or a later Node 22 release; Node 24 is not a supported production runtime.

```bash
nvm use
node --version
```

Install it once if necessary:

```bash
nvm install 22.23.1
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase configuration (migrate from Vite if needed):

```
NEXT_PUBLIC_SUPABASE_URL=        # was VITE_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # was VITE_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
```

3. Install exactly from the lockfile and run:

```bash
npm ci
npm run dev
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
- `bash scripts/verify-migration.sh` — non-destructive Phase 1 route/configuration check

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/article/[slug]` | Article detail (shareable URL) |
| `/category/[slug]` | Category listing |
| `/author/[slug]` | Author listing |
| `/latest` | Latest published articles |
| `/hot-topics` | Featured and most-read articles |
| `/search?q=...` | Published article search |
| `/login`, `/register` | Member authentication |
| `/account` | Free member account |
| `/auth/callback` | Supabase PKCE callback |
| `/forgot-password`, `/reset-password` | Password recovery |
| `/admin` | Allowlisted, trusted-role legacy administration |

## Migration note (Phase 1)

This project was migrated from Vite + React to Next.js App Router. Article slugs are derived from title + short UUID (no DB slug column yet). Sanity CMS integration is planned for Phase 2.

## Supabase setup

Configure Supabase Auth email confirmation and add these redirect URLs: `http://localhost:3000/auth/callback`, `http://localhost:3000/reset-password`, plus the corresponding production URLs. Apply migrations through the normal Supabase workflow, including the Phase 1 hardening migration. Assign `app_metadata.role = admin` only with trusted administrative tooling, then include that email in `ADMIN_EMAILS`.

Newsletter signup is a distinct opt-in and does not create a member account. Comments are temporarily read-only pending the verified-member, active-status, Sanity hot-topic, and moderation workflow.

## Sanity Studio (Phase 2A shadow mode)

The Studio is embedded at `/studio` using Sanity 6 and next-sanity. Create a Sanity project and dataset manually, then configure `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_PREVIEW_SECRET`, and `SANITY_REVALIDATE_SECRET`. Add `http://localhost:3000`, `http://127.0.0.1:3000`, and the website production origin to Sanity CORS settings before editor use. The website continues to read articles from Supabase; no live content switch or content import is included in this phase.

`node scripts/migrate-supabase-articles-to-sanity.mjs` is dry-run-only by default. It never writes unless both `--apply` and `MIGRATION_CONFIRM=YES` are supplied; do not use those write flags without explicit approval.
