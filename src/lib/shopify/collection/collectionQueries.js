import { collectionFragment, filterFragment, pageInfoFragment, productFragment } from '../fragment';

const filterCollectionForward = `
query Search($handle: String!, $first: Int!, $filters: [ProductFilter!], $sort: ProductCollectionSortKeys, $after: String) {
  collection(handle: $handle) {
    ${collectionFragment}
    products(first: $first,  filters: $filters, sortKey: $sort, after: $after) {
      filters {
        ${filterFragment}
      }
      pageInfo {
        ${pageInfoFragment}
      }
      edges {
        node {
          ${productFragment}
        }
      }
    }
  }
}`;

const getCollections = `
query ($first: Int) {
  collections(first: $first, sortKey: RELEVANCE) {
    edges {
      node {
        ${collectionFragment}
        isBannerHome: metafield(namespace: "custom", key: "bannerhome") {
          value
        }
        isMegaMenu: metafield(namespace: "custom", key: "megamenu") {
          value
          type
        }
      }
    }
  }
}`;

const getSitemap = `
query ($first: Int) {
  collections(first: $first, sortKey: RELEVANCE) {
    edges {
      node {
        handle
        products(first: 200, sortKey: BEST_SELLING) {
          edges {
            node {
              handle
            }
          }
        }
      }
    }
  }
}`;

const getCollectionFilters = `
query Search($handle: String!) {
  collection(handle: $handle) {
    products(first: 0) {
      filters {
        ${filterFragment}
      }
    }
  }
}`;

const queriesCollection = {
  filterCollectionForward,
  getCollections,
  getCollectionFilters,
  getSitemap,
};

export default queriesCollection;
