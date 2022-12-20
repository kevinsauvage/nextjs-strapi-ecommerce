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

// Customer Next Api calls
const logout = () => nextApiHelper(`${apiRoute.logout}`);
const register = (payload) => nextApiHelper(`${apiRoute.register}`, payload);
const login = (payload) => nextApiHelper(`${apiRoute.login}`, payload);
const generateDelegateToken = () => nextApiHelper(`${apiRoute.delegateToken}`);
const getCustomer = () => nextApiHelper(`${apiRoute.getUser}`, null, 'GET');

// Checkout Next Api calls
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

// Products Next Api calls
const searchProducts = (query = '') => {
  const apiUrl = `${apiRoute.products.search}?searchTerm=${query}`;
  return nextApiHelper(apiUrl, null, 'GET');
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
};

export default nextApiCall;
