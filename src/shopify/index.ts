import { GraphQLClient } from 'graphql-request';

import { getSdk as getAdminSdk } from './admin/index';
import { getSdk as getStorefrontSdk } from './storefront/index';

const ACCESS_TOKEN = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN;

const SHOPIFY_URL = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL;

if (!ACCESS_TOKEN) {
  throw new Error('Missing SHOPIFY_STORE_FRONT_ACCESS_TOKEN');
}

if (!SHOPIFY_URL) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL');
}

const headers = {
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
  },
};

const storefrontClient = new GraphQLClient(SHOPIFY_URL, headers);

export const storefrontSdk = () => {
  return getStorefrontSdk(storefrontClient);
};

const adminHeaders = {
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ADMIN_TOKEN,
  },
};

export const adminClient = new GraphQLClient(process.env.SHOPIFY_ADMIN_URL, adminHeaders);

export const adminSdk = () => {
  return getAdminSdk(adminClient);
};
