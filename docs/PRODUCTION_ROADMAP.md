# Production Roadmap

## Phase 2 — Sanity editorial platform

Create a dedicated Sanity Studio and schemas for articles, authors, categories, tags, media, SEO, homepage configuration, redirects, and editorial workflow. Migrate legacy Supabase articles into Sanity, establish stable slugs, publish only through Sanity, and remove editorial writes from Supabase after review. Keep Supabase exclusively for identity and user-generated data.

### Phase 2A status — shadow mode

The repository now contains an embedded `/studio` route, schemas, typed GROQ queries, preview/revalidation endpoints, and a dry-run-only Supabase importer. Supabase remains the live article source. Sanity requires a manually created project/dataset, CORS origins, editor accounts, image-asset mappings, preview/webhook secrets, and an approved migration dry run before any content is imported. A separate approval is required before setting any environment flag that makes the website read Sanity content.

## Phase 3 — Membership and comments

Create Supabase member profiles and subscription-status records. Keep free verified membership distinct from newsletter marketing consent. Implement server-authorized comment creation only when the member has a confirmed email and active status, the article is published, and its Sanity record is marked as a hot topic. Store authorship by user ID, support reports and moderation states, and expose moderation tools only through protected server endpoints and restrictive RLS.

## Phase 4 — SEO, media, and performance

Generate Sanity-driven metadata, canonical URLs, structured data, XML sitemap, robots directives, RSS, redirects, Open Graph images, and Arabic social metadata. Move media into managed assets, define a strict `next/image` remote-host policy, optimize image sizing, and add cache revalidation on publication.

## Phase 5 — security and operations

Apply and test the Phase 1 RLS hardening migration, manage admin roles with trusted tooling, add rate limiting and abuse controls for auth/newsletter/comments, define CSP and security headers, audit dependencies regularly, and configure monitoring, backups, retention, and incident response.

## Phase 6 — testing and deployment

Add unit tests for slugs and authorization predicates, integration tests for RLS and auth flows, route/component tests for RTL rendering, and end-to-end coverage for registration, verification, account, comments, moderation, search, and accessibility. Configure Vercel preview/production environments, required environment variables, Supabase redirect URLs, Sanity webhooks, and deployment checks before launch.
## Development editorial source

Development pages use `CONTENT_SOURCE=sanity` with the Sanity `development` dataset. There is no automatic Supabase editorial fallback. Supabase remains for auth, members, newsletter, and future comments. Studio remains blocked in production; fixture instructions are in `SANITY_DEVELOPMENT_FIXTURES.md`.
