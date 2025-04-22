import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  config: {
    fragmentMasking: false,
    gqlTagName: 'gql',
  },
  documents: 'src/shopify/admin/**/*.graphql',
  generates: {
    'src/shopify/admin/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
  overwrite: true,
  // Generate schema base on the Shopify Admin API
  // https://shopify.dev/api/admin-graphql/2025-01
  schema: [
    {
      'https://ecomfashionstore.myshopify.com/admin/api/2025-01/graphql.json': {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN,
        },
      },
    },
  ],
};

export default config;
