const apiRoute = {
  nextApi: {
    register: '/api/register',
    login: '/api/login',
    logout: '/api/logout',
  },
  strapiApi: {
    register: '/auth/local/register',
    login: '/auth/local',
    categories: '/categories',
    products: '/products',
    me: '/users/me',
  },
};
export default apiRoute;
