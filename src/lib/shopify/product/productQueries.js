import { imageFragment, productFragment } from '../fragment';

const queryProductRecommendations = `
query productRecommendations($productId: ID!) {
  productRecommendations (productId: $productId) {
    ${productFragment}
  }
}`;

const queryProduct = `
query product($handle: String) {
  product(handle: $handle) {
    ${productFragment}
  }
}`;

const queryProducts = `
query products($first: Int, $sortKey: ProductSortKeys) {
  products(first: $first, sortKey: $sortKey ) {
    edges {
      node {
        ${productFragment}
      }
    }
  }
}`;

const searchProducts = `
query products($query: String) {
  products(first: 9, query: $query) {
    edges {
      node {
        handle
        id
        title
        availableForSale
        descriptionHtml
        description
        images(first: 2) {
          edges {
            node {
              ${imageFragment}
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
        collections(first: 1) {
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

const productQueries = {
  queryProductRecommendations,
  queryProduct,
  queryProducts,
  searchProducts,
};

export default productQueries;
