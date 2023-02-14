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

export const getMenu = async (handle, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, { handle }, delegateToken, ip);

    if (res?.errors) {
      console.error(res.errors);
    }

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
export const getMetaObject = async (handle, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMetaObject, { handle }, delegateToken, ip);

    console.log('🚀 ~ file: shopApiCall.js:76 ~ getMetaObject ~ res', res);

    const value = res?.data?.page?.data?.value;
    return value ? JSON.parse(value) : undefined;
  } catch (error) {
    return console.error(error);
  }
};

export const getMetaObjects = async (handle, sortKey, first = 100, delegateToken, ip) => {
  try {
    const res = await shopifyStorefrontCall(
      shopQueries.queryMetaObjects,
      { handle, sortKey, first },
      delegateToken,
      ip
    );

    console.log('🚀 ~ file: shopApiCall.js:91 ~ getMetaObjects ~ res', res);

    const value = res?.data?.page?.data?.value;
    return value ? JSON.parse(value) : undefined;
  } catch (error) {
    return console.error(error);
  }
};
