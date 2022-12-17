import shopifyStorefrontCall from '..';
import shopQueries from './shopQueries';

export const getShop = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getShop);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

export const getPrivacyPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getPrivacyPolicy);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

export const getRefundPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getRefundPolicy);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

export const getShippingPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getShippingPolicy);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

export const getTermsOfService = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getTermsOfService);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

export const getMenuHeader = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, {
      handle: 'main-menu',
    });
    return res?.data?.menu?.items ?? [];
  } catch (err) {
    return console.error(err);
  }
};

export const getMenuFooter = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, {
      handle: 'footer',
    });
    return res?.data?.menu?.items ?? [];
  } catch (err) {
    return console.error(err);
  }
};
