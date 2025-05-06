/* eslint-disable sort-keys/sort-keys-fix */
const environment = process.env.NODE_ENV;

const config = {
  baseUrl: 'http://localhost:3000',
  cookies: {
    cartId: 'x-cart-id',
    delegateToken: 'shopify-delegate-token',
    searchParams: 'x-search-params',
    shopifyToken: 'shopify-storefront-access-token',
    shopifyTokenExpire: 'shopify-access-token-expire',
    url: 'x-url',
    userIp: 'x-user-ip',
  },
  domain: 'https://ecomfashionstore.myshopify.com',
  localStorageKeys: {
    cartIdStorageKey: 'shopify-cart-id',
  },
  name: 'Site Name',
  paymentUrl: 'https://checkout.ecomtestshopi.xyz',
  routes: {
    home: '/',
    cart: '/cart',
    about: '/about',
    login: '/login',
    collection: '/shop',
    contact: '/contact',
    account: '/account',
    addresses: '/account/addresses',
    updateAccount: '/account/update',
    wishlist: '/account/wishlist',
    updateAddress: '/account/addresses',
    createAddress: '/account/addresses/create',
    editAddress: '/account/addresses/edit',
    emailResetPassword: '/recover',
    logout: '/account/logout',
    orders: '/account/orders',
    privacy: '/privacy',
    refound: '/refound',
    register: '/register',
    resetPassword: '/reset',
    search: '/search',
    shipping: '/shipping',
    terms: '/terms',
  },
  userFeedback: {
    addLinesToCart: {
      error: 'Something went wrong adding the item to the cart, please try again',
      success: 'Item correctly added to the cart',
    },
    login: {
      error: 'There was an error trying to login',
      success: 'You were successfully logged in',
    },
    logout: {
      error: 'An error occurred while logging out',
      success: 'You were successfully logged out',
    },
    missingFields: 'Fill in missing required fields',
    passwordDifferent: 'The password are different.',
    passwordLength: 'Your password must be at least 8 characters',
    register: {
      error: 'There was an error trying to register',
      success: 'You were successfully registered',
    },
    removeLinesFromCart: {
      error: 'Something went wrong removing the item from the cart, please try again',
      success: 'Item correctly removed from the cart',
    },
    resetPassword: {
      error: 'There was an error trying to reset your password',
      success: 'Your password was successfully reset, your are logged in',
    },

    sendRecoverEmail: {
      success: 'Your email was successfully sent',
    },
    updateLines: {
      error: 'Something went wrong updating the item in the cart, please try again',
      success: 'Item correctly updated in the cart',
    },
  },
};

export const accountNav = [
  { title: 'Account overview', url: config.routes.account },
  { title: 'My details', url: config.routes.updateAccount },
  { title: 'Address book', url: config.routes.addresses },
  { title: 'My orders', url: config.routes.orders },
  { title: 'My wishlist', url: config.routes.wishlist },
  { title: 'Sign out', url: config.routes.logout },
];

if (environment === 'production') {
  config.baseUrl = 'https://www.ecomtestshopi.xyz';
}

export default config;
