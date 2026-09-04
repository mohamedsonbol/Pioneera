# Pioneera.net — Next.js

Arabic RTL digital magazine built with Next.js App Router, Tailwind CSS, and Supabase. Supabase is the temporary article source during Phase 1; Sanity is intentionally not integrated yet.

## Setup

1. Copy environment variables:

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

3. Install and run:

```bash
npm install
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
