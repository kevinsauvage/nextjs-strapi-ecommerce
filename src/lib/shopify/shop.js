const { getShopifyClient } = require('.');

export const getShopInfo = async (locale) => {
  const res = await getShopifyClient(locale).shop.fetchInfo();
  return res;
};

export const getCollections = async (locale) => {
  const res = await getShopifyClient(locale)?.collection?.fetchAll();
  return res;
};
