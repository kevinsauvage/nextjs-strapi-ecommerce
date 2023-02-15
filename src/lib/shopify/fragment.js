export const imageFragment = `
src
altText
small:  url(transform: { maxHeight: 100, maxWidth: 100, crop: CENTER, preferredContentType: WEBP })
medium:  url(transform: { maxHeight: 400, maxWidth: 400, crop: CENTER, preferredContentType: WEBP })
large:  url(transform: { maxHeight: 600, maxWidth: 600, crop: CENTER, preferredContentType: WEBP })
blurDataURL: url(transform: {maxHeight: 4, maxWidth: 4, crop: CENTER,  preferredContentType: WEBP})
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
sku
weight
weightUnit
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
images(first: 20) {
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

export const productFragmentLight = `
handle
id
title
availableForSale
productType
totalInventory

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

collections(first: 1) {
  edges {
    node {
      handle
    }
  }
}
variants(first: 1) {
  edges {
    node {
      compareAtPriceV2 {
        amount
        currencyCode
      }
      priceV2 {
        amount
        currencyCode
      }
    }
  }
}
`;

export const customerFragment = `
id
firstName
lastName
acceptsMarketing
email
phone
numberOfOrders
updatedAt
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
statusUrl
processedAt

totalPriceV2 {
 amount
 currencyCode
}

totalRefundedV2 {
  amount
  currencyCode
}

totalShippingPriceV2 {
  amount
  currencyCode
}

subtotalPriceV2 {
  amount
  currencyCode
}
totalTaxV2 {
  amount
  currencyCode
}

successfulFulfillments(first: 100) {
  trackingCompany
  trackingInfo(first: 100) {
    number
    url
  }
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
export const pageInfoFragment = `
hasNextPage
hasPreviousPage
endCursor
startCursor`;

export const customerOrdersFragment = `
orders(first: $first, after: $after) {
  pageInfo {
    ${pageInfoFragment}
  }
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
