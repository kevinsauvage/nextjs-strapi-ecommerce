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
                  sm:  url(transform: { maxHeight: 500, maxWidth: 300, crop: CENTER })
                  blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
                    sm:  url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })
                    blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
         descriptionHtml
         images(first: 20) {
           edges {
             node {
               src
               altText
               sm:  url(transform: { maxHeight: 500, maxWidth: 300, crop: CENTER })
               blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
               quantityAvailable
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
                 sm:  url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })
                 blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
                 width
                 height
               }           
             } 
           }
         }     
       }
 }`;

const getCollections = `{
  collections(first: 5, sortKey: RELEVANCE) {
    edges {
      node {
        id
        title
        handle
        description
        products(first: 5, sortKey: BEST_SELLING) {
          edges {
            node {
              handle
              id
              title
              availableForSale
              descriptionHtml
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                    sm: url(transform: {maxHeight: 500, maxWidth: 300, crop: CENTER})
                    blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
                      sm:  url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })
                      blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
  }
}
`;

const queryProduct = `query product($handle: String) {
  product(handle: $handle) {
    handle
    id
    title
    availableForSale
    descriptionHtml
    images(first: 1) {
      edges {
        node {
          src
          altText
          sm: url(transform: {maxHeight: 500, maxWidth: 300, crop: CENTER})
          blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
    options(first: 50) {
          id
          name
          values
     }
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
            sm: url(transform: {maxHeight: 800, maxWidth: 800, crop: CENTER})
            blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
`;

const queryProducts = `query products($first: Int, $sortKey: ProductSortKeys) {
  products(first: $first, sortKey: $sortKey ) {
    edges {
      node {
    handle
    id
    title
    availableForSale
    descriptionHtml
    images(first: 1) {
      edges {
        node {
          src
          altText
          sm: url(transform: {maxHeight: 500, maxWidth: 300, crop: CENTER})
          blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
    options(first: 50) {
          id
          name
          values
     }
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
            sm: url(transform: {maxHeight: 500, maxWidth: 500, crop: CENTER})
            blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
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
`;

const queries = {
  getCollectionFilters,
  filterCollection,
  productTags,
  queryProductRecommendations,
  getCollections,
  queryProduct,
  queryProducts,
};

export default queries;
