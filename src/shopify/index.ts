import { GraphQLClient } from 'graphql-request';
import type { RequestConfig } from 'node_modules/graphql-request/build/esm/types';

import config from '@/config';

import { getSdk as getAdminSdk } from './admin/index';
import { buildExtraHeaders } from './helpers';
import type { SdkFunctionWrapper } from './storefront/index';
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

const createStorefrontClient = (cacheOption: 'default' | 'no-store' = 'default') => {
  const options = {
    fetch: async (url: string, parameters: RequestInit) => {
      const fetchOptions: RequestInit = {
        ...parameters,
      };

      if (cacheOption === 'no-store') {
        fetchOptions.cache = 'no-store';
      } else {
        fetchOptions.next = { revalidate: config.constants.revalidate.shopify };
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch from Shopify: ${response.statusText}`);
      }

      return response;
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    },
  };

  return new GraphQLClient(SHOPIFY_URL, options as RequestConfig);
};

const storefrontClient = createStorefrontClient('default');

const defaultWrapper: SdkFunctionWrapper = async (
  action,
  _operationName,
  _operationType,
  _variables: Record<string, unknown>,
) => {
  const extraHeader = await buildExtraHeaders({});

  try {
    return await action(extraHeader);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Error in GraphQL request:',
        JSON.stringify(
          {
            _operationName,
            _operationType,
            _variables,
            error: error.message,
          },
          undefined,
          2,
        ),
      );
      throw error;
    }
    throw error;
  }
};

export const storefrontSdk = (cacheOption: 'default' | 'no-store' = 'default') => {
  const client = cacheOption === 'no-store' ? createStorefrontClient('no-store') : storefrontClient;
  return getStorefrontSdk(client, defaultWrapper);
};

const adminHeaders = {
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ADMIN_TOKEN || '',
  },
};

export const adminClient = new GraphQLClient(process.env.SHOPIFY_ADMIN_URL || '', adminHeaders);

export const adminSdk = () => {
  return getAdminSdk(adminClient);
};
