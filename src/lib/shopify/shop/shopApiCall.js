import shopifyStorefrontCall from '..';
import shopQueries from './shopQueries';

/**
 * It's a function that makes a call to the Shopify Storefront API and returns the shop object.
 * @returns An object with the following properties:
 */
export const getShop = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getShop);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It's a function that makes a call to the Shopify Storefront API and returns the data from the call.
 * @returns An array of objects.
 */
export const getPrivacyPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getPrivacyPolicy);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It's a function that makes a call to the Shopify Storefront API to get the refund policy of a
 * Shopify store.
 * @returns The return value is an array of objects.
 */
export const getRefundPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getRefundPolicy);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It's a function that makes a call to the Shopify Storefront API to get the shipping policy of a
 * Shopify store.
 * @returns An array of objects.
 */
export const getShippingPolicy = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getShippingPolicy);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It's a function that makes a call to the Shopify Storefront API to get the Terms of Service for the
 * store.
 * @returns The return value is an array of objects.
 */
export const getTermsOfService = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getTermsOfService);
    return res?.data?.shop ?? [];
  } catch (err) {
    return console.error(err);
  }
};

/**
 * It's a function that makes a call to the Shopify Storefront API to get the menu items for the main
 * menu.
 * @returns An array of objects.
 */
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

/**
 * It's a function that makes a call to the Shopify Storefront API to get the menu items for the footer
 * menu.
 * @returns An array of objects.
 */
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

export const getMenuCollection = async () => {
  try {
    const res = await shopifyStorefrontCall(shopQueries.getMenu, {
      handle: 'collections-menu',
    });

    return res?.data?.menu?.items ?? [];
  } catch (err) {
    return console.error(err);
  }
};
