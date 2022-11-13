const env = process.env.NODE_ENV;

const config = {
  baseUrl: 'https://localhost:3000',
  name: 'Site Name',
  routes: {
    home: '/',
    about: '/about',
    contact: '/contact',
    collection: '/collections',
    product: '/product',
    terms: '/shop/terms',
    privacy: '/shop/privacy',
    refound: '/shop/refound',
    shipping: '/shop/shipping',
    login: '/user/auth/login',
    register: '/user/auth/register',
    account: '/user/account',
    resetPassword: '/user/reset/email',
  },
  homeBanner: {
    upTitle: '',
    title: 'Choose Your New Look',
    subtitle: 'See our clothing collections',
    buttonText: 'SEE COLLECTIONS',
    imageUrl:
      'https://res.cloudinary.com/kevincloudname/image/upload/v1668351722/ecom/banner1_qxsejx.jpg',
    link: '/collections',
  },
};

if (env === 'production') {
  config.baseUrl = 'http://site_url.com';
}

export default config;
