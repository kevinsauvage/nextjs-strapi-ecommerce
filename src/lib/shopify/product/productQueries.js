import { productFragment } from '../fragment';

const queryProductRecommendations = `query productRecommendations($productId: ID!) {
  productRecommendations (productId: $productId) {
    ${productFragment}
  }
}`;

const queryProduct = `query product($handle: String) {
  product(handle: $handle) {
    ${productFragment}
  }
}`;

const queryProducts = `query products($first: Int, $sortKey: ProductSortKeys) {
  products(first: $first, sortKey: $sortKey ) {
    edges {
      node {
        ${productFragment}
      }
    }
  }
}`;

const productQueries = {
  queryProductRecommendations,
  queryProduct,
  queryProducts,
};

export default productQueries;
