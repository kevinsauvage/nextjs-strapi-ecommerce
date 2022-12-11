const apiRoute = {
  login: '/api/customer/login',
  logout: '/api/customer/logout',
  register: '/api/customer/register',
  delegateToken: '/api/customer/delegateToken',
  getUser: '/api/customer/customer',
  associateCustomerToCheckout: '/api/checkout/associateCustomerToCheckout',
  resetPassword: '/api/customer/password/reset',
};

const nextApiHelper = async (url, body = {}, method = 'POST') => {
  const object = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) object.body = JSON.stringify(body);

  const res = await fetch(url, object);

  return res ? res.json() : undefined;
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

const nextApiCall = {
  login,
  logout,
  register,
  generateDelegateToken,
  getCustomer,
  associateCustomerToCheckout,
  resetPassword,
};

export default nextApiCall;
