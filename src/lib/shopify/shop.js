const { getShopifyClient, apiCall } = require('.');

export const getShopInfo = async (locale) => {
  const res = await getShopifyClient(locale).shop.fetchInfo();
  return res;
};

export const getCollections = async (locale) => {
  const res = await getShopifyClient(locale)?.collection?.fetchAll();
  return res;
};

export const getCollectionByHandle = async (handle, first = 40) => {
  const query = `
  {
    collectionByHandle(handle: "${handle}") {
      title
      products(first: ${first}) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            availableForSale
            compareAtPriceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            handle
            id
            images(first: 1) {
              edges {
                node{
                  altText
                  transformedSrc(maxWidth: 500, maxHeight: 400, crop: CENTER)
                }
              }
            }
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }

            productType
            tags
            title
            totalInventory
            vendor
            variants(first: 100) {
              edges {
                node {
                  availableForSale
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
                  id
                  image {
                    transformedSrc(maxWidth: 500, maxHeight: 400, crop: CENTER)
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  quantityAvailable
                  title
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  return apiCall(query);
};
