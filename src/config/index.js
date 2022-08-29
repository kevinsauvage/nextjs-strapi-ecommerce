const env = process.env.NODE_ENV;

const config = {
  baseUrl: 'https://localhost:3000',
  footer: {
    totalCategoryCount: null,
  },
};

if (env === 'production') {
  config.baseUrl = 'http://site_url.com';
}

export default config;
