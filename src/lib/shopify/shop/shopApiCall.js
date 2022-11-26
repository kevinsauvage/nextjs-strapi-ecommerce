import shopifyStorefrontCall from '..';
import shopQueries from './shopQueries';

export const getShop = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getShop);
  return res?.shop ?? [];
};

export const getMenuHeader = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getMenu, {
    handle: 'main-menu',
  });
  return res?.menu?.items ?? [];
};

export const getMenuFooter = async () => {
  const res = await shopifyStorefrontCall(shopQueries.getMenu, {
    handle: 'footer',
  });
  return res?.menu?.items ?? [];
};
