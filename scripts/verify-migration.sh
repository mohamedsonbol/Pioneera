#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

required=(
  app/layout.tsx
  app/page.tsx
  app/latest/page.tsx
  app/hot-topics/page.tsx
  app/search/page.tsx
  app/login/page.tsx
  app/register/page.tsx
  app/account/page.tsx
  app/auth/callback/route.ts
  app/forgot-password/page.tsx
  app/reset-password/page.tsx
)

for file in "${required[@]}"; do
  test -f "$file"
done

test -f supabase/migrations/20260829120434_create_pioneera_schema.sql
test -f supabase/migrations/20260904000000_harden_legacy_access.sql
test -f .env.example

echo "Phase 1 route, migration, and environment checks passed. No files were modified."
