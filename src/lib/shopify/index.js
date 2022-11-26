const shopifyStorefrontCall = async (query, variables) => {
  try {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN}/api/2022-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token':
            process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );
    const res = await response.json();
    if (res.errors) {
      console.log(res.errors);
    }
    return res;
  } catch (error) {
    // TODO HANDLE ERRORS
    return console.error(error);
  }
};

export default shopifyStorefrontCall;
