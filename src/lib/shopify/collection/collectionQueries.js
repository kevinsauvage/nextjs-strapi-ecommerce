import {
  collectionFragment,
  filterFragment,
  pageInfoFragment,
  productFragment,
} from '../fragment';

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
        metafield( 
          namespace: "custom"
          key: "bannerhome"
      ) {
          key
          value
        }
      }
    }
  }
}`;

const getCollectionsWithProducts = `
query ($first: Int){
  collections(first: $first, sortKey: RELEVANCE) {
    edges {
      node {
        ${collectionFragment}
        products(first: 20, sortKey: BEST_SELLING) {
          edges {
            node {
              ${productFragment}
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
  getCollectionsWithProducts,
  filterCollectionForward,
  getCollections,
  getCollectionFilters,
};

export default queriesCollection;
