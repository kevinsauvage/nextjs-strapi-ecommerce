const getShop = `
query {
  shop {
    description
    name
    primaryDomain {
      host
      url
    }
  }
}`;

const getPrivacyPolicy = `
query {
  shop {
    privacyPolicy {
        body
    }
  }
}`;

const getRefundPolicy = `
query {
  shop {
    refundPolicy {
      body
    }
  }
}`;

const getShippingPolicy = `
query {
  shop {
    shippingPolicy {
      body
    }
  }
}`;

const getTermsOfService = `
query {
  shop {
    termsOfService {
      body
    }
  }
}`;

const getMenu = `
query ($handle: String!) {
  menu(handle: $handle) {
    id
    items {
        id
        resourceId
        tags
        title
        type
        url
      items {
        id
        resourceId
        tags
        title
        type
        url
        items {
          id
          resourceId
          tags
          title
          type
          url
        }
      }
    }
  }
}`;

const getPage = `
query ($handle: String!) {
  page(handle: $handle) {
    bodySummary
    handle
    id
    data: metafield(namespace: "custom", key: "data") {
      value
      type
    }
  }
}
`;

const getMetaObject = `
query ($handle: MetaobjectHandleInput) {
  metaobject(handle: $handle) {
    fields {
      key
      value
    }
  }
}
`;

const queryMetaObjects = `
query getMetaObjects(
  $type: String!,
  $sortKey: String,
  $first: Int,
  $reverse: Boolean
){
  metaobjects(
    type: $type,
    sortKey: $sortKey,
    first: $first,
  ) {
    edges {
      node {
        id
        fields {
          key
          value
        }
        handle
        updatedAt
        type
      }
    }
  }
}`;

const shopQueries = {
  getShop,
  getMenu,
  getPage,
  getPrivacyPolicy,
  getRefundPolicy,
  getShippingPolicy,
  getTermsOfService,
  getMetaObject,
  queryMetaObjects,
};

export default shopQueries;
