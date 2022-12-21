/* eslint-disable import/prefer-default-export */
const { setCookie } = require('nookies');

const expiresIn = 24 * 60 * 60;

/**
 * It sets a cookie with the key of "shopifyToken" and the value of the token that was passed in.
 * @param res - The response object from the server
 * @param key - 'shopifyToken'
 * @param token - the token that you get from the shopify API
 * @returns the function setCookie.
 */
export const handleSetShopifyTokenCookies = (res, key, token) => {
  if (!token || !key || !res) return;
  const expiresDate = new Date(new Date().getTime() + expiresIn * 1000);

  const cookieValue = JSON.stringify({
    expires: expiresDate,
    token,
  });

  setCookie({ res }, key, cookieValue, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/',
  });
};
