import apiRoute from '../data/apiRoute';

export function getStrapiURL(path) {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
  }/api${path}`;
}

const apiHelper = async (url, body = {}, method = 'POST', token) => {
  try {
    const object = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) object.body = JSON.stringify(body);
    if (token) object.headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, object);

    const result = res && (await res.json());
    const { error, data } = result;
    if (error) throw error;
    if (data) return data;
    return result;
  } catch (e) {
    console.log(e);
  }
};

const getCategories = (locale) =>
  apiHelper(
    getStrapiURL(
      `${apiRoute.strapiApi.categories}?populate=*&locale=${locale}`
    ),
    null,
    'GET'
  );

const getCategory = (id, locale) =>
  apiHelper(
    getStrapiURL(
      `${apiRoute.strapiApi.categories}/${id}?populate=*&locale=${locale}`
    ),
    null,
    'GET'
  );

const getProducts = (locale) =>
  apiHelper(
    getStrapiURL(`${apiRoute.strapiApi.products}?populate=*&locale=${locale}`),
    null,
    'GET'
  );

const getProduct = (id, locale) =>
  apiHelper(
    getStrapiURL(
      `${apiRoute.strapiApi.products}${id}?populate=*&locale=${locale}`
    ),
    null,
    'GET'
  );

const getMe = async (token) =>
  apiHelper(getStrapiURL(apiRoute.strapiApi.me), null, 'get', token);

const apiCall = {
  product: {
    getProduct,
    getProducts,
  },
  category: {
    getCategory,
    getCategories,
  },
  user: {
    getMe,
  },
};

export default apiCall;
