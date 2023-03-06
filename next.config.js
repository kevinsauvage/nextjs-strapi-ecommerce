/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.shopify.com'],
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
  experimental: {
    // This is experimental but can
    // be enabled to allow parallel threads
    // with nextjs automatic static generation
    workerThreads: false,
    cpus: 1,
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
