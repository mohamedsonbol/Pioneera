# Security Notes

Updated: 2026-11-20

## Application boundaries

- WordPress at `cms.pioneera.net` is the only content source and member-management backend. The Next.js application performs no content writes.
- `/admin` redirects to WordPress admin. The `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/account` routes are static notices linking to WordPress.
- The homepage newsletter section is informational; no subscriber data is collected by the application.
- No service-role key, database URL, or privileged credential is read by application code or included in `.env.example`. Only `CONTENT_SOURCE`, `WORDPRESS_API_URL`, and the optional `NEXT_PUBLIC_SITE_URL` are used.

## Dependency advisories

The 2026-11 dependency remediation resolved all npm advisories, including the brace-expansion, flatted, glob, minimatch, picomatch, postcss-selector-parser, sanitize-html, and zod findings. `npm audit` and `npm audit --omit=dev` both report zero vulnerabilities. Avoid `npm audit fix --force` without a dedicated compatibility review.

## Node.js baseline

Local and production validation uses Node **22.23.1** (supported range `>=22.23.1 <23`, pinned in `.nvmrc`). Select it with `nvm use` before installing or building. Node 24 is not a supported production baseline.

## Remote images

Article images come from WordPress and are rendered with a fallback component. If `next/image` is adopted, use an explicit remote-host allowlist rather than a universal HTTP/HTTPS policy.

## Deployment

Production deployments are triggered by pushes to `main`. Before release, run `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, `npm audit`, and `npm run build`, and confirm the WordPress origin and site URL environment values are set in the deployment environment.
