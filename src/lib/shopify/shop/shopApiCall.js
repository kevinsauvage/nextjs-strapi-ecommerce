import shopifyStorefrontCall from '..';
import shopQueries from './shopQueries';

// eslint-disable-next-line import/prefer-default-export
export const getShop = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getShop);
  return res?.shop ?? [];
};
