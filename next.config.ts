import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'http', hostname: 'books.google.com' }],
  },
};

export default nextConfig;
