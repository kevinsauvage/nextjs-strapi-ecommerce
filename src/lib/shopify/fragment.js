export const imageFragment = `
src
altText
small:  url(transform: { maxHeight: 225, maxWidth: 150, crop: CENTER, preferredContentType: WEBP })
medium:  url(transform: { maxHeight: 600, maxWidth: 400, crop: CENTER, preferredContentType: WEBP })
large:  url(transform: { maxHeight: 900, maxWidth: 600, crop: CENTER, preferredContentType: WEBP })
blurDataURL: url(transform: {maxHeight: 6, maxWidth: 4, crop: CENTER,  preferredContentType: WEBP})
width
height`;

export const addressFragment = `
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
zip`;

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
  ${imageFragment}
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
totalPrice {
  amount
  currencyCode
}
subtotalPrice {
  amount
  currencyCode
}
shippingLine {
  price {
    amount
    currencyCode
  }
}
orderStatusUrl
lineItemsSubtotalPrice {
  amount
  currencyCode
}

shippingAddress {
  ${addressFragment}
}
lineItems(first: 100) {
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
images(first: 6) {
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
variants(first: 8) {
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
 ${addressFragment}
}`;

export const orderFragment = `
id
name
fulfillmentStatus
currencyCode
customerUrl
email
financialStatus
orderNumber
phone
processedAt
totalRefunded {
  amount
  currencyCode
}
totalShippingPrice {
  amount
  currencyCode
}
totalPrice {
  amount
  currencyCode
}
cancelReason
canceledAt
shippingAddress {
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
}`;

export const customerOrdersFragment = `
orders(first: 10) {
  edges {
    node {
        ${orderFragment}
    }
  }
}`;

export const collectionFragment = `
handle
description
title
id
image {
  ${imageFragment}
}
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
