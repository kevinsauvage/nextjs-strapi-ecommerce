import type { CodegenConfig } from '@graphql-codegen/cli';

const getAdminSchemaUrl = (): string => {
  const url = process.env.SHOPIFY_ADMIN_URL;

  if (!url) {
    throw new Error(
      'Missing SHOPIFY_ADMIN_URL environment variable. ' +
        'Set it to your Shopify Admin API endpoint (e.g., https://your-store.myshopify.com/admin/api/2025-01/graphql.json)',
    );
  }

  return url;
};

const getAccessToken = (): string => {
  const accessToken = process.env.SHOPIFY_STORE_FRONT_ADMIN_TOKEN;

  if (!accessToken) {
    throw new Error(
      'Missing SHOPIFY_STORE_FRONT_ADMIN_TOKEN environment variable. ' +
        'This is required for GraphQL schema introspection.',
    );
  }

  return accessToken;
};

const adminSchemaUrl = getAdminSchemaUrl();
const adminToken = getAccessToken();

const config: CodegenConfig = {
  config: {
    fragmentMasking: false,
    gqlTagName: 'gql',
  },
  documents: 'src/shopify/admin/**/*.graphql',
  generates: {
    'src/shopify/admin/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        scalars: {
          ARN: 'string',
          BigInt: 'string',
          Color: 'string',
          Date: 'string',
          DateTime: 'string',
          Decimal: 'string',
          FormattedString: 'string',
          HTML: 'string',
          JSON: 'any',
          Money: 'string',
          StorefrontID: 'string',
          URL: 'string',
          UnsignedInt64: 'string',
          UtcOffset: 'string',
        },
      },
    },
  },
  overwrite: true,
  schema: {
    [adminSchemaUrl]: {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
    },
  },
};

export default config;
