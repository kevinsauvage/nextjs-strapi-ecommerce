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

const filterCollectionBackward = `
query Search($handle: String!, $last: Int!, $filters: [ProductFilter!], $sort: ProductCollectionSortKeys, $before: String) {
  collection(handle: $handle) {
    ${collectionFragment}
    products(last: $last,  filters: $filters, sortKey: $sort, before: $before) {
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

const queriesCollection = {
  getCollectionsWithProducts,
  filterCollectionForward,
  filterCollectionBackward,
  getCollections,
};

export default queriesCollection;
