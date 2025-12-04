/* eslint-disable unicorn/prefer-module */
/** @type {import('next').NextConfig} */

const nextConfig = {
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
    return [
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
    ];
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.shopify.com'],
    unoptimized: true,
  },
  reactStrictMode: true,

  redirects() {
    return [
      {
        destination: '/',
        permanent: true,
        source: '/404',
      },
    ];
  },
};

module.exports = nextConfig;
