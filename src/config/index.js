const env = process.env.NODE_ENV;

const config = {
  baseUrl: 'http://localhost:3000',
  paymentUrl: 'https://checkout.ecomtestshopi.xyz',
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
    login: '/auth/login',
    register: '/auth/register',
    account: '/account',
    emailResetPassword: '/user/reset/email',
    resetPassword: '/user/reset/password',
    orders: '/orders',
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
  userFeedback: {
    // globals
    missingFields: 'Fill in missing required fields',

    // Customer
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

    // checkout
    removeLinesFromCheckout: {
      success: 'Item correctly removed from the cart',
      error:
        'Something went wrong removing the item from the cart, please try again',
    },
    addLinesToCheckout: {
      success: 'Item correctly added to the cart',
      error:
        'Something went wrong adding the item to the cart, please try again',
    },
    updateLines: {
      success: 'Item correctly updated in the cart',
      error:
        'Something went wrong updating the item in the cart, please try again',
    },
  },
};

if (env === 'production') {
  config.baseUrl = 'https://www.ecomtestshopi.xyz';
}

export default config;
