# Pioneera.net — Next.js

Arabic RTL digital magazine built with Next.js App Router, Tailwind CSS, and the WordPress REST API. WordPress is the only content and member-management backend; the Next.js app has no separate database or authentication service.

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

3. Fill in the WordPress configuration:

```
CONTENT_SOURCE=wordpress
WORDPRESS_API_URL=https://cms.pioneera.net/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Install exactly from the lockfile and run:

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
- `bash scripts/verify-migration.sh` — non-destructive route/configuration check

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
| `/login`, `/register` | Static notices linking to WordPress |
| `/forgot-password`, `/reset-password` | Static notices linking to WordPress |
| `/account` | Static notice linking to WordPress |
| `/auth/callback` | Legacy callback that redirects to WordPress |
| `/admin` | Redirects to WordPress admin |

## Migration note (Phase 1)

This project was migrated from Vite + React to Next.js App Router. Public article slugs and all editorial content come from WordPress.

## Members and newsletter

Member accounts, sign-in, and administration are handled by WordPress at `https://cms.pioneera.net/wp-admin`. The Next.js routes for authentication remain as informational notices that link there. The homepage newsletter section is currently disabled pending a WordPress-based plan.

For hot topics, use the WordPress category slug `hot-topics` as the canonical CMS convention. Sticky posts remain compatible so existing editorial promotions continue to appear.

## Archived planning documents

Historical planning and fixture documents remain in `docs/` for the transition record. They are archived and are not runtime configuration.
