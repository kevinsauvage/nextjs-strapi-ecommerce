import shopifyStorefrontCall from '..';
import shopQueries from './shopQueries';

export const getShop = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getShop);
  return res?.data?.shop ?? [];
};

export const getMenuHeader = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getMenu, {
    handle: 'main-menu',
  });
  return res?.data?.menu?.items ?? [];
};

export const getMenuFooter = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getMenu, {
    handle: 'footer',
  });
  return res?.data?.menu?.items ?? [];
};
