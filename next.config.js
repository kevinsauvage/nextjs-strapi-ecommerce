/** @type {import('next').NextConfig} */
const path = require('path');
const { i18nNextConfig } = require('./src/config/i18n');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'cdn.shopify.com'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, './src/styles/')],
    prependData: `
        @import "variables.scss"; 
        @import "responsive.scss"; 
        @import "colors.scss"; 
        @import "mixins.scss"; 
        @import "animation.scss";`,
  },

  ...i18nNextConfig,
};

module.exports = nextConfig;
