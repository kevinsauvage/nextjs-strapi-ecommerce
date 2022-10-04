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
            options {
              id
              name
              values
            }
            collections(first: 1) {
              edges {
                node {
                  handle
                }
              }
             }   
            availableForSale
            handle
            id
            descriptionHtml
            images(first: 1) {
              edges {
                node{
                  src
                  altText
                  sm:  url(transform: { maxHeight: 750, maxWidth: 500, crop: CENTER })
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
                    sm:  url(transform: { maxHeight: 750, maxWidth: 500, crop: CENTER })
                    blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
                    width
                    height
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
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

const getCollections = `query ($first: Int) {
  collections(first: $first, sortKey: RELEVANCE) {
    edges {
      node {
        id
        title
        handle
        description
      }
    }
  }
}
`;

const getCollectionsWithProducts = `query ($first: Int){
  collections(first: $first, sortKey: RELEVANCE) {
    edges {
      node {
        id
        title
        handle
        description
        products(first: 20, sortKey: BEST_SELLING) {
          edges {
            node {
              collections(first: 1) {
                edges {
                  node {
                    handle
                  }
                }
               }   
              handle
              id
              title
              availableForSale
              descriptionHtml
              options {
                id
                name
                values
              }
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                    sm:  url(transform: { maxHeight: 750, maxWidth: 500, crop: CENTER })
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
                    selectedOptions {
                      name
                      value
                    }
                    id
                    image {
                      src
                      altText
                      sm:  url(transform: { maxHeight: 750, maxWidth: 500, crop: CENTER })
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

const queriesCollection = {
  getCollectionsWithProducts,
  getCollectionFilters,
  filterCollection,
  getCollections,
};

export default queriesCollection;
