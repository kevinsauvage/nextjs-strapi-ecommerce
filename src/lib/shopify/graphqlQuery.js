const getCollectionFilters = `query Facets($handle: String!) {
    collectionByHandle(handle: $handle) {
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

const filterCollection = `
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

const queries = { getCollectionFilters, filterCollection };

export default queries;
