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

  images: {
    domains: ['res.cloudinary.com', 'cdn.shopify.com'],
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
