export const variantFragment = `
id
availableForSale
quantityAvailable
title
compareAtPriceV2 {
  amount
  currencyCode
}
selectedOptions {
  name
  value
}
image {
  src
  altText
  s:  url(transform: { maxHeight: 400, maxWidth: 275, crop: CENTER })
  sm:  url(transform: { maxHeight: 750, maxWidth: 500, crop: CENTER })
  blurDataURL: url(transform: {maxHeight: 10, maxWidth: 10, crop: CENTER})
  width
  height
}
priceV2 {
  amount
  currencyCode
}
product {
  handle
  title
  collections(first: 1) {
     nodes {
        handle
     }
  }
}

`;

export const checkoutFragment = `
webUrl
completedAt
createdAt
currencyCode
email
id
totalPrice
orderStatusUrl
lineItemsSubtotalPrice {
  amount
  currencyCode
}
lineItems(first: 250) {
  edges {
    node {
      id
      title
      quantity
      variant {
          ${variantFragment}
      }
    }
  }
}`;

export const productFragment = `
handle
id
title
availableForSale
descriptionHtml
images(first: 50) {
  edges {
    node {
      src
      altText
      s:  url(transform: { maxHeight: 400, maxWidth: 275, crop: CENTER })
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
collections(first: 1) {
  edges {
    node {
      handle
    }
  }
} 
variants(first: 250) {
  edges {
    node {
      ${variantFragment}
    }
  }
}`;

export const customerFragment = `
id
firstName
lastName
acceptsMarketing
email
phone
defaultAddress {
  id
  address1
  address2
  city
  company
  country
  countryCodeV2
  firstName
  formatted
  formattedArea
  lastName
  name
  phone
  province
  provinceCode
  zip
}

addresses(first: 250) {
  edges {
    node {
      id
      address1
      address2
      city
      company
      country
      countryCodeV2
      firstName
      formatted
      formattedArea
      lastName
      name
      phone
      province
      provinceCode
      zip
    }
  }
}
orders(first: 10) {
  edges {
      node {
          id
          name
          totalPrice
          fulfillmentStatus
          currencyCode
      }
  }
}`;

export const collectionFragment = `
handle
description
title
seo {
  description
  title
}`;

export const filterFragment = `
id
label
type
values {
  id
  label
  count
  input
}`;

export const pageInfoFragment = `
hasNextPage
hasPreviousPage
endCursor
startCursor`;
