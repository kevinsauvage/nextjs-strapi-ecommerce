const { setCookie } = require('nookies');

const expiresIn = 24 * 60 * 60;

// eslint-disable-next-line import/prefer-default-export
export const handleSetShopifyTokenCookies = (res, key, token) => {
  if (!token || !key || !res) return;
  const expiresDate = new Date(new Date().getTime() + expiresIn * 1000);

  const cookieValue = JSON.stringify({
    expires: expiresDate,
    token,
  });

  setCookie({ res }, 'shopifyToken', cookieValue, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: expiresIn,
    path: '/',
  });
};
