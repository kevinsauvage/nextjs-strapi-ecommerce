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
  query Search($handle: String!, $first: Int!, $filters: [ProductFilter!], $sort: ProductCollectionSortKeys) {
    collection(handle: $handle) {
      handle
      products(first: $first, filters: $filters, sortKey: $sort) {
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
            descriptionHtml
            images(first: 1) {
              edges {
                node{
                  src
                  altText
                  transformedSrc(maxWidth: 500, maxHeight: 600)
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
            variants(first: 10) {
              edges {
                node {
                  availableForSale
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
                  id
                  image {
                    src
                    altText
                    transformedSrc(maxWidth: 500, maxHeight: 600)
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

const productTags = `query {
    productTags(first: 50) {
        edges {
            node 
          }
    }
  }`;

const queryProductRecommendations = `query productRecommendations ($productId: ID!){
  productRecommendations (productId: $productId) {
   description
         handle
         id
         images(first: 20) {
           edges {
             node {
               src
               altText
               transformedSrc(maxWidth: 500, maxHeight: 600)
               width
               height
             }
           }
         }
         priceRange {
           maxVariantPrice {
             amount
           }
           minVariantPrice {
             amount
           }
         }
         productType
         tags
         title
         variants(first: 20) {
           edges {
             node {
               sku
               availableForSale
               id
               compareAtPriceV2 {
                 amount
                 currencyCode
               }
               priceV2 {
                 amount
                 currencyCode
               }
               title
               image {
                 src
                 altText
                 transformedSrc(maxWidth: 500, maxHeight: 600)
                 width
                 height
               }           
             } 
           }
         }     
       }
 }`;

const queries = {
  getCollectionFilters,
  filterCollection,
  productTags,
  queryProductRecommendations,
};

export default queries;
