# Production Roadmap

## Current state

WordPress is the single source of truth for editorial content and member accounts. The Next.js application is read-only with respect to content; all sign-in and administration happens at `https://cms.pioneera.net/wp-admin`.

## Phase 1 — WordPress editorial source (complete)

Public pages read from the WordPress REST API through `lib/editorial/`. Hot topics use the WordPress `hot-topics` category slug and sticky posts. Article slugs, media, authors, and categories come from WordPress.

## Phase 2 — newsletter

Define a WordPress-hosted newsletter signup flow, then re-enable the homepage newsletter section against that endpoint. The section is currently informational only.

## Phase 3 — member experience

Decide which member-only features (if any) the Next.js app should present, using WordPress as the identity provider. Current auth routes are static notices linking to WordPress.

## Phase 4 — SEO, media, and performance

Add canonical URLs, structured data, sitemap, robots directives, RSS, redirects, Open Graph metadata, and an explicit `next/image` remote-host policy. Add cache revalidation on publication.

## Phase 5 — security and operations

Keep dependency advisories remediated, add rate limiting and abuse controls at the WordPress edge, define CSP and security headers, and configure monitoring, backups, retention, and incident response.

## Phase 6 — testing and deployment

Maintain route/component tests for RTL rendering and end-to-end coverage for search, categories, articles, and accessibility. Configure Vercel preview/production environments, required environment variables, and deployment checks. Production deployments are triggered by pushes to `main`.
