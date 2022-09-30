const queryCreateCart = `mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
    } 
}`;

const queryCartById = `query($id: ID!) {
    cart(
      id: $id
    ) {
      id
      createdAt
      updatedAt
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                availableForSale
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                
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
            attributes {
              key
              value
            }
          }
        }
      }
      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
      buyerIdentity {
        email
        phone
        customer {
          id
        }
        countryCode
      }
    }
  }`;

const queryAddBuyerIdentityToCart = `mutation cartBuyerIdentityUpdate(
    $buyerIdentity: CartBuyerIdentityInput!
    $cartId: ID!
  ) {
    cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  availableForSale
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
                  
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
              attributes {
                key
                value
              }
            }
          }
        }
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
        buyerIdentity {
          email
          phone
          customer {
            id
          }
          countryCode
        }
      }
    }
  }
  `;

const queryAddLines = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
            id
            createdAt
            updatedAt
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                        id
                        availableForSale
                        compareAtPriceV2 {
                          amount
                          currencyCode
                        }
                        
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
                  attributes {
                    key
                    value
                  }
                }
              }
            }
            attributes {
              key
              value
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
              totalDutyAmount {
                amount
                currencyCode
              }
            }
            buyerIdentity {
              email
              phone
              customer {
                id
              }
              countryCode
            }
          }
      userErrors {
        field
        message
      }
    }
  }`;

const queryRemoveFromCart = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
            id
            createdAt
            updatedAt
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                        id
                        availableForSale
                        compareAtPriceV2 {
                          amount
                          currencyCode
                        }
                        
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
                  attributes {
                    key
                    value
                  }
                }
              }
            }
            attributes {
              key
              value
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
              totalDutyAmount {
                amount
                currencyCode
              }
            }
            buyerIdentity {
              email
              phone
              customer {
                id
              }
              countryCode
            }
          }
      userErrors {
        field
        message
      }
    }
  }`;
const cartQueries = {
  queryCreateCart,
  queryCartById,
  queryAddBuyerIdentityToCart,
  queryAddLines,
  queryRemoveFromCart,
};

export default cartQueries;
