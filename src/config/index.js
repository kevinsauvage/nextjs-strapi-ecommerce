const env = process.env.NODE_ENV;

const config = {
  baseUrl: 'http://localhost:3000',
  paymentUrl: 'https://checkout.ecomtestshopi.xyz',
  name: 'Site Name',
};

config.userFeedback = {
  missingFields: 'Fill in missing required fields',
  passwordLength: 'Your password must be at least 8 characters',
  register: {
    success: 'You were successfully registered',
    error: 'There was an error trying to register',
  },
  login: {
    success: 'You were successfully logged in',
    error: 'There was an error trying to login',
  },
  resetPassword: {
    success: 'Your password was successfully reset, your are logged in',
    error: 'There was an error trying to reset your password',
  },
  sendRecoverEmail: {
    success: 'Your email was successfully sent',
  },
  logout: {
    error: 'An error occurred while logging out',
    success: 'You were successfully logged out',
  },
  removeLinesFromCheckout: {
    success: 'Item correctly removed from the cart',
    error: 'Something went wrong removing the item from the cart, please try again',
  },
  addLinesToCheckout: {
    success: 'Item correctly added to the cart',
    error: 'Something went wrong adding the item to the cart, please try again',
  },
  updateLines: {
    success: 'Item correctly updated in the cart',
    error: 'Something went wrong updating the item in the cart, please try again',
  },
};

config.routes = {
  home: '/',
  about: '/about',
  contact: '/contact',
  collection: '/shop',
  product: '/product',
  search: '/search',
  terms: '/pages/terms',
  privacy: '/pages/privacy',
  refound: '/pages/refound',
  shipping: '/pages/shipping',
  login: '/login',
  logout: '/logout',
  register: '/register',
  cart: '/cart',
  account: '/account',
  emailResetPassword: '/send_recovery_email',
  resetPassword: '/reset_password',
  orders: '/account/orders',
  addresses: '/account/addresses',
  createAddress: '/account/addresses/create',
  updateAddress: '/account/addresses',
  updateAccount: '/account/update',
};

config.accountNav = [
  { url: config.routes.account, title: 'Account overview' },
  { url: config.routes.addresses, title: 'Address book' },
  { url: config.routes.orders, title: 'My orders' },
  { url: config.routes.updateAccount, title: 'My details' },
  { url: config.routes.logout, title: 'Sign out ' },
];

config.localStorageKeys = {
  checkoutIdSorageKey: 'shopifyCheckoutId',
};

config.cookies = {
  shopifyToken: 'shopify-access-token',
  shopifyTokenExpire: 'shopify-access-token-expire',
};

if (env === 'production') {
  config.baseUrl = 'https://www.ecomtestshopi.xyz';
}

export default config;
