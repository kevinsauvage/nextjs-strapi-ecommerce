import apiRoute from '../data/apiRoute';

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

const logout = () => nextApiHelper(`${apiRoute.nextApi.logout}`);
const register = (payload) =>
  nextApiHelper(`${apiRoute.nextApi.register}`, payload);
const login = (payload) => nextApiHelper(`${apiRoute.nextApi.login}`, payload);
const saveToken = (payload) =>
  nextApiHelper(`${apiRoute.nextApi.saveToken}`, payload);

const generateDelegateToken = () =>
  nextApiHelper(`${apiRoute.nextApi.delegateToken}`);

const nextApiCall = {
  auth: {
    login,
    logout,
    register,
  },
  generateDelegateToken,
  saveToken,
};

export default nextApiCall;
