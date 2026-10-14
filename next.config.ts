import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Next 16.4's default CLI config reader cannot consume tsc's output in this build environment.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
