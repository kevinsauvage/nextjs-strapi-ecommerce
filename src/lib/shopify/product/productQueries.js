const productTags = `query {
    productTags(first: 50) {
        edges {
            node 
          }
    }
  }`;

const queryProductRecommendations = `query productRecommendations($productId: ID!) {
  productRecommendations (productId: $productId) {
   description
         handle
         id
         descriptionHtml
         options {
          id
          name
          values
        }
         images(first: 20) {
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
           }
           minVariantPrice {
             amount
           }
         }
         productType
         tags
         title
         variants(first: 250) {
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
               selectedOptions {
                name
                value
              }
               image {
                 src
                 altText
                 sm:  url(transform: { maxHeight: 750, maxWidth: 500, crop: CENTER })
                 blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
                 width
                 height
               }           
             } 
           }
         }
         collections(first: 1) {
          edges {
            node {
              handle
            }
          }
         }     
       }
 }`;

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
    options {
          id
          name
          values
     }
    totalInventory
    vendor
    variants(first: 250) {
      edges {
        node {
          availableForSale
          compareAtPriceV2 {
            amount
            currencyCode
          }
          id
          selectedOptions {
            name
            value
          }
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
`;

const queryProducts = `query products($first: Int, $sortKey: ProductSortKeys) {
  products(first: $first, sortKey: $sortKey ) {
    edges {
      node {
    handle
    id
    title
    options {
      id
      name
      values
    }
    availableForSale
    descriptionHtml
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
    collections(first: 1) {
      edges {
        node {
          handle
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
    variants(first: 250) {
      edges {
        node {
          availableForSale
          compareAtPriceV2 {
            amount
            currencyCode
          }
          id
          selectedOptions {
            name
            value
          }
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
`;

const queryProductVariant = `query product($handle: String, $input: [SelectedOptionInput!]!) {
  product(handle: $handle) {
    variantBySelectedOptions(selectedOptions: $input) {
      availableForSale
      compareAtPriceV2 {
        amount
        currencyCode
      }
      id
      selectedOptions {
        name
        value
      }
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
`;
const productQueries = {
  productTags,
  queryProductRecommendations,
  queryProduct,
  queryProducts,
  queryProductVariant,
};

export default productQueries;
