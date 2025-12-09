/* eslint-disable sort-keys */
import type { MetadataRoute } from 'next';

import { COOKIES, LOCAL_STORAGE_KEYS } from './constants';

const config = {
  cookies: COOKIES,
  localStorageKeys: LOCAL_STORAGE_KEYS,
  name: 'Ecom Test Shopi',
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
    refund: '/refund',
    register: '/register',
    resetPassword: '/reset',
    search: '/search',
    shipping: '/shipping',
    terms: '/terms',
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
    url: config.routes.refund,
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

export default config;
