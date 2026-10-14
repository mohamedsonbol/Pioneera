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

This project was migrated from Vite + React to Next.js App Router. Public article slugs now come from WordPress.

## Supabase setup

Configure Supabase Auth email confirmation and add these redirect URLs: `http://localhost:3000/auth/callback`, `http://localhost:3000/reset-password`, plus the corresponding production URLs. Apply migrations through the normal Supabase workflow, including the Phase 1 hardening migration. Assign `app_metadata.role = admin` only with trusted administrative tooling, then include that email in `ADMIN_EMAILS`.

Newsletter signup is a distinct opt-in and does not create a member account. Discussion is unavailable until WordPress membership and comments are implemented.

## WordPress editorial source

Public editorial pages use the WordPress REST API. Set `CONTENT_SOURCE=wordpress` and `WORDPRESS_API_URL=https://cms.pioneera.net/wp-json/wp/v2`; WordPress access is server-only, cached with short revalidation, and never falls back to Supabase. The embedded `/studio`, Sanity draft preview, and Sanity webhook routes are disabled during this migration. Supabase remains responsible for authentication and newsletter subscriptions; member discussion is unavailable until WordPress membership/comments are implemented.

For hot topics, use the WordPress category slug `hot-topics` as the canonical CMS convention. Sticky posts remain compatible so existing editorial promotions continue to appear.

Historical Sanity planning and fixture documents remain in `docs/` for the transition record. They are archived and are not runtime configuration.
