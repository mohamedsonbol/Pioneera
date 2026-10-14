import type { NextConfig } from 'next';

// Keep generated Next output inside the already ignored temporary workspace.
// The legacy .next cache is root-owned and cannot be safely reused here.
const nextConfig: NextConfig = { distDir: 'tmp/next' };

export default nextConfig;
