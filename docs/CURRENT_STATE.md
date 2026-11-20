# Current State Audit

Updated: 2026-11-20

## Architecture

The application is an Arabic-first, RTL digital magazine built with Next.js 16 App Router, React 19, Tailwind CSS, and the WordPress REST API. WordPress (`cms.pioneera.net`) is the sole content source and member-management backend.

There is no separate database, ORM, identity provider, or server-side data mutation layer in this repository. All editorial reads go through `lib/editorial/`, and the only configuration is `CONTENT_SOURCE`, `WORDPRESS_API_URL`, and `NEXT_PUBLIC_SITE_URL`.

## Routes

Public routes (`/`, `/article/[slug]`, `/category/[slug]`, `/author/[slug]`, `/latest`, `/hot-topics`, `/search`) read from the WordPress repository. The `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/account` routes are static notices pointing to WordPress; `/auth/callback` and `/admin` redirect to WordPress. The homepage newsletter section is informational only until a WordPress-based signup flow is planned.

## Supabase removal (2026-11-20)

The Supabase packages, browser/server clients, session proxy, auth provider, member panels, newsletter submission, admin CRUD helpers, migration SQL, CLI configuration, and Supabase-specific tests and documentation were removed. No Supabase environment variables are read by the application.

## Tooling and build status

Production and local tooling use Node **22.23.1** with npm 10.9.8 (`>=22.23.1 <23` in `package.json`, pinned in `.nvmrc`). Next.js is pinned at 16.4.6 and the production build uses the webpack compiler. Dependency advisories were remediated in 2026-11; `npm audit` reports zero findings. Validation commands are `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.

## Security notes

No service-role or privileged database credentials exist in the application. Public environment variables contain only the site URL. See `SECURITY_NOTES.md` for the current dependency and deployment notes.
