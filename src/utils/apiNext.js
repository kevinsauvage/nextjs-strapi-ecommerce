const apiRoute = {
  login: '/api/customer/login',
  logout: '/api/customer/logout',
  register: '/api/customer/register',
  delegateToken: '/api/customer/delegateToken',
  getUser: '/api/customer/customer',
  associateCustomerToCheckout: '/api/checkout/associateCustomerToCheckout',
  resetPassword: '/api/customer/password/reset',
  customer: {
    sendRecoverEmail: '/api/customer/password/sendRecoverEmail',
    addresses: '/api/customer/addresses',
    defaultAddress: '/api/customer/defaultAddress',
  },
  checkout: {
    getCheckout: '/api/checkout/getCheckout',
    addToCheckout: '/api/checkout/addToCheckout',
    removeLinesFromCheckout: '/api/checkout/removeLinesFromCheckout',
    checkoutLineItemsUpdate: '/api/checkout/checkoutLineItemsUpdate',
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
const generateDelegateToken = () => nextApiHelper(`${apiRoute.delegateToken}`);
const getCustomer = () => nextApiHelper(`${apiRoute.getUser}`, null, 'GET');

const associateCustomerToCheckout = (id) => {
  const apiUrl = `${apiRoute.associateCustomerToCheckout}?checkout_id=${id}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const resetPassword = (password, url) => {
  const apiUrl = `${apiRoute.resetPassword}?password=${password}&url=${url}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const getCheckout = () => {
  const apiUrl = `${apiRoute.checkout.getCheckout}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const addToCheckout = (payload) => {
  const apiUrl = `${apiRoute.checkout.addToCheckout}`;
  return nextApiHelper(apiUrl, payload, 'POST');
};

const removeLinesFromCheckout = (payload) => {
  const apiUrl = `${apiRoute.checkout.removeLinesFromCheckout}`;
  return nextApiHelper(apiUrl, payload, 'POST');
};

const checkoutLineItemsUpdate = (payload) => {
  const apiUrl = `${apiRoute.checkout.checkoutLineItemsUpdate}`;
  return nextApiHelper(apiUrl, payload, 'POST');
};

const sendRecoverEmail = (payload) => {
  const apiUrl = `${apiRoute.customer.sendRecoverEmail}`;
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

const deleteAddress = (payload) => {
  const apiUrl = `${apiRoute.customer.addresses}`;
  return nextApiHelper(apiUrl, payload, 'DELETE');
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
  const apiUrl = `${apiRoute.customer.addresses}/${addressId}`;
  return nextApiHelper(apiUrl, null, 'GET');
};

const updateAddress = (payload, id) => {
  const apiUrl = `${apiRoute.customer.addresses}/${id}`;
  return nextApiHelper(apiUrl, payload, 'PUT');
};

const nextApiCall = {
  login,
  logout,
  register,
  generateDelegateToken,
  getCustomer,
  sendRecoverEmail,
  associateCustomerToCheckout,
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
};

export default nextApiCall;
