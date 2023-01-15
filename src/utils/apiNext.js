const apiRoute = {
  login: '/api/customer/auth/login',
  logout: '/api/customer/auth/logout',
  register: '/api/customer/auth/register',
  delegateToken: '/api/delegateToken',

  customer: {
    index: '/api/customer',
    password: '/api/customer/password',
    addresses: '/api/customer/addresses',
    defaultAddress: '/api/customer/defaultAddress',
    orders: '/api/customer/orders',
  },

  checkout: {
    index: '/api/checkout',
    lineItems: '/api/checkout/lineItems',
  },

  products: {
    search: '/api/product/search',
  },
};

/**
 * It's a wrapper for the fetch API that allows you to make requests to your Next.js API routes
 * @param url - The url of the API endpoint
 * @param [body] - The body of the request.
 * @param [method=POST] - The HTTP method to use. Defaults to POST.
 * @returns The return value is the response from the server.
 */
const nextApiHelper = async (url, body = {}, method = 'POST') => {
  try {
    const object = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) object.body = JSON.stringify(body);

    const res = await fetch(url, object);

    return res ? res.json() : undefined;
  } catch (err) {
    return console.error(err);
  }
};

const logout = () => nextApiHelper(`${apiRoute.logout}`);
const register = (payload) => nextApiHelper(`${apiRoute.register}`, payload);
const login = (payload) => nextApiHelper(`${apiRoute.login}`, payload);
const generateDelegateToken = () => nextApiHelper(`${apiRoute.delegateToken}`, null, 'GET');
const getCustomer = () => nextApiHelper(`${apiRoute.customer.index}`, null, 'GET');

const updateCustomer = (payload) => nextApiHelper(`${apiRoute.customer.index}`, payload, 'PUT');

const resetPassword = (password, url) => {
  const apiUrl = `${apiRoute.customer.password}?password=${password}&url=${url}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const getCheckout = () => {
  const apiUrl = `${apiRoute.checkout.index}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const addToCheckout = (payload) => {
  const apiUrl = `${apiRoute.checkout.lineItems}`;
  return nextApiHelper(apiUrl, payload, 'POST');
};

const removeLinesFromCheckout = (id) => {
  const apiUrl = `${apiRoute.checkout.lineItems}/id?id=${encodeURIComponent(id)}`;
  return nextApiHelper(apiUrl, null, 'DELETE');
};

const checkoutLineItemsUpdate = (payload) => {
  const apiUrl = `${apiRoute.checkout.lineItems}`;
  return nextApiHelper(apiUrl, { lineItems: payload }, 'PUT');
};

const checkoutUpdateShippingAddress = (payload) => {
  const apiUrl = `${apiRoute.checkout.index}`;
  return nextApiHelper(apiUrl, payload, 'PUT');
};

const sendRecoverEmail = (payload) => {
  const apiUrl = `${apiRoute.customer.password}`;
  return nextApiHelper(apiUrl, payload, 'POST');
};

const searchProducts = (query = '') => {
  const apiUrl = `${apiRoute.products.search}?searchTerm=${query}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const createAddress = (payload) => {
  const apiUrl = `${apiRoute.customer.addresses}`;
  return nextApiHelper(apiUrl, payload, 'POST');
};

const deleteAddress = (addressId) => {
  const id = encodeURIComponent(addressId);
  const apiUrl = `${apiRoute.customer.addresses}/id?id=${id}`;
  return nextApiHelper(apiUrl, null, 'DELETE');
};

const getCustomerAddresses = () => {
  const apiUrl = `${apiRoute.customer.addresses}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const updateCustomerDefaultAddress = (addressId) => {
  const apiUrl = `${apiRoute.customer.defaultAddress}`;
  return nextApiHelper(apiUrl, { addressId }, 'PUT');
};

const getAddressById = (addressId) => {
  const apiUrl = `${apiRoute.customer.addresses}/id?id=${addressId}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const updateAddress = (payload, addressId) => {
  const apiUrl = `${apiRoute.customer.addresses}/id?id=${addressId}`;
  return nextApiHelper(apiUrl, payload, 'PUT');
};

const getCustomerOrders = () => {
  const apiUrl = `${apiRoute.customer.orders}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const getOrderById = (orderId) => {
  const apiUrl = `${apiRoute.customer.orders}/id?id=${orderId}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const nextApiCall = {
  login,
  logout,
  register,
  generateDelegateToken,
  getCustomer,
  sendRecoverEmail,
  resetPassword,
  getCheckout,
  addToCheckout,
  removeLinesFromCheckout,
  checkoutLineItemsUpdate,
  searchProducts,
  updateAddress,
  createAddress,
  deleteAddress,
  getCustomerAddresses,
  updateCustomerDefaultAddress,
  getAddressById,
  getCustomerOrders,
  getOrderById,
  updateCustomer,
  checkoutUpdateShippingAddress,
};

export default nextApiCall;
