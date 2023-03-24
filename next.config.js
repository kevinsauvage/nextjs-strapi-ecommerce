/* eslint-disable unicorn/prefer-module */
/** @type {import('next').NextConfig} */

const path = require('node:path');

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
  async redirects() {
    return [
      {
        destination: '/',
        permanent: true,
        source: '/404',
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, './src/styles/')],
    prependData: `
        @import "_variables.scss";
        @import "_mixins.scss";
        @import "_responsive.scss";
        @import "_themes.scss";
        `,
  },
};

module.exports = nextConfig;
