import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Sanity's current runtime advisory set is unresolved. Keep the embedded Studio
  // unreachable in production until a compatible upstream patch is available.
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/studio')) {
    return new NextResponse('Not found', { status: 404 });
  }

  let supabaseResponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Permit dependency builds and static error pages without credentials. Runtime
  // routes still require the documented variables for real Supabase access.
  if (!url || !key) return supabaseResponse;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] };
