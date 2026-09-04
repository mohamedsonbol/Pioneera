import 'server-only';

import type { User } from '@supabase/supabase-js';

export function isConfiguredAdmin(user: User | null): boolean {
  if (!user || user.app_metadata.role !== 'admin') return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(user.email && allowlist.includes(user.email.toLowerCase()));
}
