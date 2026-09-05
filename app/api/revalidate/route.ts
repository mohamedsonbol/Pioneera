import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { hasValidSecret, safeRelativePath } from '@/lib/sanity/security.mjs';

export async function POST(request: Request) {
  if (!hasValidSecret(request.headers.get('x-sanity-webhook-secret'), process.env.SANITY_REVALIDATE_SECRET)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({})) as { path?: string };
  revalidateTag('sanity', 'max');
  revalidatePath(safeRelativePath(body.path, '/'));
  return NextResponse.json({ revalidated: true });
}
