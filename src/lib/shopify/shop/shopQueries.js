const getShop = `query {
    shop {
        description
        name
        primaryDomain {
          host
          url
        }
        privacyPolicy {
            body
        }
        refundPolicy {
            body
        }
        shippingPolicy {
            body
        }
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
          }
        }
    }
  }
  `;

const shopQueries = {
  getShop,
  getMenu,
};

export default shopQueries;
