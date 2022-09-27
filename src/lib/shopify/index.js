const shopifyStorefrontCall = async (query, variables) => {
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
  if (res && res.data) return res.data;

  if (res && res.errors) {
    return console.error(res.errors);
    // TODO HANDLE ERRORS
  }
  return res;
};

export default shopifyStorefrontCall;
