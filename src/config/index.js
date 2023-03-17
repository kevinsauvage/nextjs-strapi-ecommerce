const environment = process.env.NODE_ENV;

const config = {
  baseUrl: 'http://localhost:3000',
  domain: 'https://ecomfashionstore.myshopify.com',
  name: 'Site Name',
  paymentUrl: 'https://checkout.ecomtestshopi.xyz',
};

config.userFeedback = {
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
};

config.routes = {
  about: '/about',
  account: '/account',
  addresses: '/account/addresses',
  cart: '/cart',
  collection: '/shop',
  contact: '/contact',
  createAddress: '/account/addresses/create',
  emailResetPassword: '/recover',
  home: '/',
  login: '/login',
  logout: '/logout',
  orders: '/account/orders',
  privacy: '/pages/privacy',

  product: '/product',
  refound: '/pages/refound',
  register: '/register',
  resetPassword: '/reset',
  search: '/search',
  shipping: '/pages/shipping',
  terms: '/pages/terms',
  updateAccount: '/account/update',
  updateAddress: '/account/addresses',
  wishlist: '/wishlist',
};

config.accountNav = [
  { title: 'Account overview', url: config.routes.account },
  { title: 'Address book', url: config.routes.addresses },
  { title: 'My orders', url: config.routes.orders },
  { title: 'My details', url: config.routes.updateAccount },
  { title: 'Sign out ', url: config.routes.logout },
];

config.localStorageKeys = {
  cartIdStorageKey: 'shopify-cart-id',
  checkoutIdSorageKey: 'shopifyCheckoutId',
};

config.cookies = {
  shopifyToken: 'shopify-access-token',
  shopifyTokenExpire: 'shopify-access-token-expire',
};

if (environment === 'production') {
  config.baseUrl = 'https://www.ecomtestshopi.xyz';
}

export default config;
