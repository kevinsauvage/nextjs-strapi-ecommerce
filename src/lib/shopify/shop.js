const { getShopifyClient } = require('.');

export const getShopInfo = async () => {
  const res = await getShopifyClient().shop.fetchInfo();
  return res;
};

export const getCollections = async () => {
  const res = await getShopifyClient().collection.fetchAll();
  return res;
};
