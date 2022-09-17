const {
  apiCall,
  parseShopifyResponse,
  getShopifyClient,
  apiCallTest,
} = require('.');

const cleanProducts = (prod) => {
  const products = prod.edges.map((product) => ({
    ...product.node,
    images: product.node.images.edges[0].node,
    variants: product.node.variants.edges.map((variant) => ({
      ...variant.node,
    })),
  }));
  return products;
};

export const getCollectionFilters = async (handle) => {
  const query = `query Facets {
        collectionByHandle(handle: "${handle}") {
          handle
          products(first: 200) {
            filters {
              id
              label
              type
              values {
                id
                label
                count
                input
              }
            }
          }
        }
      }`;
  const res = await apiCall(query);
  const parsed = parseShopifyResponse(res);
  return parsed?.collectionByHandle?.products?.filters;
};

export const filterCollection = async (handle, first = 10, filters) => {
  const query = `
  query Search($handle: String!, $first: Int!, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      handle
      products(first: $first, filters: $filters) {
        pageInfo {
          hasNextPage
          endCursor
          startCursor
        }
        edges {
          node {
            availableForSale
            handle
            id
            images(first: 1) {
              edges {
                node{
                  altText
                  transformedSrc(maxWidth: 500, maxHeight: 500, crop: CENTER)
                  width
                  height
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
                    width
                    height
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

  const res = await apiCallTest(query, { handle, first, filters });

  if (res) {
    const products = cleanProducts(res?.collection?.products);
    const pageInfo = res?.collection?.products?.pageInfo;

    return { products, pageInfo };
  }
  return false;
};

export const getCollectionsByHandle = (handle, page, query) =>
  getShopifyClient().collection.fetchByHandle(handle, {
    productsFirst: page,
    filters: [query],
  });
