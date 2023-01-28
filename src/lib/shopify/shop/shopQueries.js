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

const getHome = `
{
  page(handle: "home") {
    bodySummary
    handle
    id

    data: metafield(namespace: "custom", key: "data") {
      value
      type
    }
    data2: metafield(namespace: "custom", key: "something") {
      value
      type
    }

  }
}
`;

const shopQueries = {
  getShop,
  getMenu,
  getHome,
  getPrivacyPolicy,
  getRefundPolicy,
  getShippingPolicy,
  getTermsOfService,
};

export default shopQueries;
