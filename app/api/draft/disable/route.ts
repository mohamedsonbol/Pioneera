import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import { safeRelativePath } from '@/lib/sanity/security.mjs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  (await draftMode()).disable();
  return NextResponse.redirect(new URL(safeRelativePath(url.searchParams.get('redirect')), url.origin));
}
