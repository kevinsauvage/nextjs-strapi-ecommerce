import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    cpus: 1,
    // This is experimental but can
    // be enabled to allow parallel threads
    // with nextjs automatic static generation
    workerThreads: false,
  },

  headers() {
    return Promise.resolve([
      {
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
        source: '/(.*)',
      },
    ]);
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.shopify.com'],
    unoptimized: true,
  },
  reactStrictMode: true,

  redirects() {
    return Promise.resolve([
      {
        destination: '/',
        permanent: true,
        source: '/404',
      },
    ]);
  },
};

export default nextConfig;
