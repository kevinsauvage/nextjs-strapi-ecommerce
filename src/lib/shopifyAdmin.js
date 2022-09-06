const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME,
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
  password: process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN,
});

export const createCustomer = async (customer) =>
  shopify.customer
    .create(customer)
    .then((res) => res)
    .catch((err) => console.error(err));

export const deleteCustomer = async (customerId) =>
  shopify.customer
    .delete(customerId)
    .then((res) => res)
    .catch((err) => console.error(err));

export const updateCustomer = async (customerId, customer) =>
  shopify.customer
    .update(customerId, customer)
    .then((res) => res)
    .catch((err) => console.error(err));
