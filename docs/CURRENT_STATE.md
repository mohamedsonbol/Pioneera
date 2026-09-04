# Current State Audit

Audit date: 2026-09-04

## Pre-implementation working tree snapshot

This snapshot was recorded before Phase 1 implementation. All changes below were already present and are preserved as user work.

`git status --short` reported modified Bolt configuration files, `.gitignore`, `README.md`, `package.json`, `package-lock.json`, `postcss.config.js`, the existing Supabase migration, `tailwind.config.js`, and `tsconfig.json`. It reported the legacy Vite entry point, configuration, TypeScript configuration, ESLint configuration, and `src/` tree as deleted. It reported `.env.example`, `.eslintrc.json`, `app/`, `components/`, `lib/`, `middleware.ts`, `next.config.ts`, and `scripts/` as untracked.

`git diff --stat` reported 37 tracked files changed, with 4,611 insertions and 7,234 deletions. There were no staged changes.

## Application and visual structure

The project began as a Bolt-generated Vite 5, React 18, TypeScript, and Tailwind application. It is an Arabic-first, RTL digital magazine with Tajawal sans-serif and Amiri serif fonts, a pink brand palette, amber accent palette, and neutral ink palette.

The existing visual hierarchy is: dark social/utility bar; white logo, search, and navigation header; mobile navigation; breaking-news ticker; featured article hero with secondary stories; category sections; video section; newsletter signup; dark footer; and back-to-top control. Article pages retain their hero, metadata, author, article body, comments area, and related-articles presentation. This Phase 1 work preserves that hierarchy and responsive styling.

## Existing routes and architecture

Before implementation, the partial App Router migration already supplied `/`, `/article/[slug]`, `/category/[slug]`, `/author/[slug]`, and `/admin`. It used Server Components for page data loading and client components for header interaction, article view counting/comments, newsletter submission, auth state, and the admin dashboard.

The required `/latest`, `/hot-topics`, `/search`, `/login`, `/register`, `/account`, `/auth/callback`, `/forgot-password`, and `/reset-password` routes were not present. Route-level loading and error boundaries were also absent.

## Supabase data and authentication

The existing migration defines `articles`, `comments`, and `newsletter_subscribers`. Articles have title, text content, category, image URL, author, publication/feature flags, views, read time, and timestamps. Comments are moderated through `is_approved`; newsletter email addresses are stored independently.

At audit time, all authenticated users could perform article, comment-moderation, and newsletter-administration mutations through permissive RLS policies and browser-side admin calls. Comments could be inserted anonymously from the browser. These conditions do not meet the target authorization model. The existing migration is intentionally not changed by this phase, so the application must not expose those mutation paths.

There is no member-profile table, subscription-status model, role model, reports table, editorial workflow, or Sanity integration yet.

## Tooling and build status

`package.json` contained Next `^15.1.0`, React `^18.3.1`, TypeScript `^5.5.3`, ESLint 9, Tailwind 3, Supabase JS, and `@supabase/ssr`. Strict TypeScript is enabled. The installed lockfile had no `node_modules` present, so the pre-install `npm run typecheck` result was `tsc: not found`; lint and production build could not be run meaningfully at that point.

## Security and migration risks

- The partial migration used an outdated Next.js release and a deprecated `next lint` script.
- Article slugs are derived from a title plus a short UUID, requiring an article list query for resolution and allowing a theoretical short-ID ambiguity.
- The current remote-image configuration accepts every HTTP and HTTPS domain.
- Browser-side writes for comments and the admin dashboard bypass the desired server authorization boundary.
- The old migration verification script recursively deleted legacy files and was unsafe to run in a working tree.
- Supabase remains the temporary article source for Phase 1 only; future editorial records must be migrated to Sanity without competing writes.

## Secret scan

No tracked `.env` files, private keys, JWTs, common cloud access keys, or obvious API-key patterns were found in the current tree or Git history. Secret values were not printed. Environment variable names for public Supabase configuration were found in source and examples, as expected.
