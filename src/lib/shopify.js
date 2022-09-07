import Client from 'shopify-buy';

export const parseShopifyResponse = (response) =>
  JSON.parse(JSON.stringify(response));

export const getShopifyClient = (language) => {
  const config = {
    storefrontAccessToken:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    domain: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN,
    language: language || 'en',
  };

  return Client.buildClient({ ...config });
};

const apiCall = async (query) => {
  try {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN}/api/2022-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql',
          'X-Shopify-Storefront-Access-Token':
            process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
        },
        body: query,
      }
    );
    const res = await response.json();
    if (res && res.data) return res.data;

    if (res && res.errors) {
      console.log(res.errors);
      // TODO HANDLE ERRORS
    }
    return res;
  } catch (err) {
    console.log(err);
    // TODO handle error here
  }
};

export const registerCustomer = async (email, password, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}){
    customerCreate(input: {
      email:"${email}", 
      password:"${password}"
    }) {
      userErrors { field message }
      customer { id }
    }
  }`;
  return apiCall(mutation);
};

export const loginCustomer = async (email, password, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}) { 
    customerAccessTokenCreate(input: {
      email:"${email}", 
      password:"${password}"
    }) { 
      customerAccessToken { accessToken expiresAt }, 
      customerUserErrors { code field message } 
    } 
  }`;

  return apiCall(mutation);
};

export const sendRecoverEmail = (email, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}) {
  customerRecover(email: "${email}") { customerUserErrors { code field message} }
  }`;

  return apiCall(mutation);
};

export const resetCustomerPassword = (password, resetUrl, language) => {
  const mutation = `mutation @inContext(language: ${language.toUpperCase()}) {
    customerResetByUrl(resetUrl: "${resetUrl}", password: "${password}") {
      customer { id, email },
      customerAccessToken { accessToken expiresAt }, 
      customerUserErrors { code field message}
    }
  }`;

  console.log(mutation);

  return apiCall(mutation);
};
