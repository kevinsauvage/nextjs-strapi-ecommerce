import shopifyStorefrontCall from '..';
import shopQueries from './shopQueries';

export const getShop = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getShop);
    return res?.data?.shop ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getPrivacyPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getPrivacyPolicy);
    return res?.data?.shop ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getRefundPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getRefundPolicy);
    return res?.data?.shop ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getShippingPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getShippingPolicy);
    return res?.data?.shop ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getTermsOfService = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getTermsOfService);
    return res?.data?.shop ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getMenuHeader = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, { handle: 'main-menu' });
    return res?.data?.menu?.items ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getMenuFooter = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, { handle: 'footer' });
    return res?.data?.menu?.items ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getMenuCollection = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, { handle: 'collections-menu' });

    return res?.data?.menu?.items ?? [];
  } catch (error) {
    return console.error(error);
  }
};

export const getPage = async (handle) => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getPage, { handle });
    const value = res?.data?.page?.data?.value;
    return value ? JSON.parse(value) : undefined;
  } catch (error) {
    return console.error(error);
  }
};
