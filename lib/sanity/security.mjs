import { timingSafeEqual } from 'node:crypto';

export function hasValidSecret(candidate, expected) {
  if (!candidate || !expected) return false;
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer);
}

export function safeRelativePath(path, fallback = '/') {
  return path?.startsWith('/') && !path.startsWith('//') ? path : fallback;
}
