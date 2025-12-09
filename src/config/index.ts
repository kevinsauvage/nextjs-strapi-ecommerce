/* eslint-disable sort-keys/sort-keys-fix */
import type { MetadataRoute } from 'next';

import { COOKIES, LOCAL_STORAGE_KEYS } from './constants';

const environment = process.env.NODE_ENV;

const config = {
  baseUrl: 'http://localhost:3000',
  cookies: COOKIES,
  domain: 'https://ecomfashionstore.myshopify.com',
  localStorageKeys: LOCAL_STORAGE_KEYS,
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

export const sitemap: MetadataRoute.Sitemap = [
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 1,
    url: config.routes.home,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.collection,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.cart,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.contact,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.about,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.privacy,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.refound,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.shipping,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.terms,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.register,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.login,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.resetPassword,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.emailResetPassword,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.search,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.logout,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.updateAccount,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.createAddress,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.editAddress,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.updateAddress,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.addresses,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.wishlist,
  },
  {
    changeFrequency: 'daily',
    lastModified: new Date().toISOString(),
    priority: 0.8,
    url: config.routes.orders,
  },
];

if (environment === 'production') {
  config.baseUrl = 'https://www.ecomtestshopi.xyz';
}

export default config;
