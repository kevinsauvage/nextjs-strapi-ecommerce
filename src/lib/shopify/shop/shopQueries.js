const getShop = `query {
    shop {
        description
        name
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

const shopQueries = {
  getShop,
};

export default shopQueries;
