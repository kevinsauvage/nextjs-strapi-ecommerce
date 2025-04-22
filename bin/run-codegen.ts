import { generate } from '@graphql-codegen/cli';

import 'dotenv/config'; // should be at the very top

import configAdmin from '../codegen.admin';
import configStorefront from '../codegen.storefront';

const generateSchemas = async () => {
  try {
    await generate(configStorefront, true);
    console.info('✅ Storefront Codegen complete');

    await generate(configAdmin, true);
    console.info('✅ Admin Codegen complete');
  } catch (error) {
    console.error('❌ Codegen failed', error);
  }
};

generateSchemas()
  .then(() => {
    console.info('✅ Codegen complete');
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => {
    console.error('❌ Codegen failed', error);
  });
