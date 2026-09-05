import 'server-only';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env';

export { isSanityConfigured };
export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' });

export async function fetchSanity<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  if (!isSanityConfigured) throw new Error('Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.');
  return sanityClient.fetch<T>(query, params, { next: { revalidate: 60, tags: ['sanity'] } });
}
