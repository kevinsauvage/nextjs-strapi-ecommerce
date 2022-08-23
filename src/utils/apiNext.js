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

const register = (user) => nextApiHelper(`${apiRoute.nextApi.register}`, user);
const login = (user) => nextApiHelper(`${apiRoute.nextApi.login}`, user);
const logout = () => nextApiHelper(`${apiRoute.nextApi.logout}`);

const nextApiCall = {
  auth: {
    register,
    login,
    logout,
  },
};

export default nextApiCall;
