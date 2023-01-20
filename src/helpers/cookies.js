const { setCookie } = require('nookies');

const expiresIn = 24 * 60 * 60;

export const handleSetShopifyTokenCookies = (res, key, token) => {
  if (!token || !key || !res) return;
  const expiresDate = new Date(new Date().getTime() + expiresIn * 1000);
  const cookieValue = JSON.stringify({ expires: expiresDate, token });

  setCookie({ res }, key, cookieValue, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/',
  });
};

export const setDelegateTokenCookie = (res, token) => {
  setCookie({ res }, 'shopifyDelegateToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/',
  });
};
