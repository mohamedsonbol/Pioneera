import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import { hasValidSecret, safeRelativePath } from '@/lib/sanity/security.mjs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!hasValidSecret(url.searchParams.get('secret'), process.env.SANITY_PREVIEW_SECRET)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(safeRelativePath(url.searchParams.get('redirect')), url.origin));
}
