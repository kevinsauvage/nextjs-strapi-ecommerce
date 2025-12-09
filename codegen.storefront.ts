import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: 'src/shopify/storefront/**/*.graphql',
  generates: {
    'src/shopify/storefront/index.ts': {
      config: {
        scalars: {
          Color: 'string',
          DateTime: 'string',
          Decimal: 'string',
          HTML: 'string',
          ISO8601DateTime: 'string',
          JSON: 'any',
          URL: 'string',
          UnsignedInt64: 'string',
        },
      },
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
  // Generate schema base on the Shopify Storefront API
  // https://shopify.dev/api/storefront/2025-01
  schema: {
    'https://ecomfashionstore.myshopify.com/api/2025-01/graphql.json': {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN || '',
      },
    },
  },
};

export default config;
