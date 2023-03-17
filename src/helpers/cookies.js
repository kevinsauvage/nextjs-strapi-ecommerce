/* eslint-disable no-restricted-syntax */
import { setCookie } from 'nookies';

import config from '@/config/index';
import getClient from '@/shopify/index';

const COOKIE_EXPIRATION_TIME = 24 * 60 * 60; // 1 day in seconds
const NODE_ENV_DEVELOPMENT = 'development';
const COOKIE_SAME_SITE = 'strict';

export const handleSetCookies = (
  response,
  name,
  value,
  maxAge = COOKIE_EXPIRATION_TIME,
  httpOnly = false
) => {
  if (!value || !name || !response) {
    console.error('Invalid arguments for setting cookie');
    return;
  }

  try {
    const expiresDate = new Date(Date.now() + maxAge * 1000);
    const cookieValue = JSON.stringify({ expiresDate, value });

    const options = {
      httpOnly,
      maxAge,
      path: '/',
      sameSite: COOKIE_SAME_SITE,
      secure: process.env.NODE_ENV !== NODE_ENV_DEVELOPMENT,
    };

    setCookie({ res: response }, name, cookieValue, options);
  } catch (error) {
    console.error(`Error setting cookie: ${error}`);
    throw error;
  }
};

// eslint-disable-next-line consistent-return
export const getCookieFront = (name) => {
  const cookies = document.cookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (const cooky of cookies) {
    const cookie = cooky.trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.slice(Math.max(0, name.length + 1));
    }
  }
};

export const setCookieFront = (cName, cValue, expDays = 1, secure = true, sameSite = 'Lax') => {
  if (typeof cName !== 'string' || typeof expDays !== 'number') {
    throw new TypeError('Invalid input parameters');
  }

  const date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;

  let cookie = `${cName}=${cValue}; ${expires}; path=/`;
  if (secure) {
    cookie += '; Secure';
  }
  if (sameSite) {
    cookie += `; SameSite=${sameSite}`;
  }

  try {
    // eslint-disable-next-line unicorn/no-document-cookie
    if (typeof document !== 'undefined') document.cookie = cookie;
  } catch (error) {
    console.error(`Failed to set cookie: ${error}`);
  }
};

export const handleSetTokenCookies = (accessToken, callback) => {
  const maxAgeInDays = 1;
  const date = new Date();
  date.setDate(date.getDate() + maxAgeInDays);
  setCookieFront(config.cookies.shopifyToken, accessToken, 1, false);
  setCookieFront(config.cookies.shopifyTokenExpire, JSON.stringify(date), 1, false);
  if (callback && typeof callback === 'function') callback();
};

export const handleGetTokenCookies = async () => {
  let shopifyToken = getCookieFront(config.cookies.shopifyToken);

  const shopifyTokenExpire = getCookieFront(config.cookies.shopifyTokenExpire);
  if (!shopifyTokenExpire) return;

  const data = new Date();
  const secondsNow = Math.abs(data.getTime());

  const expiresDate = new Date(JSON.parse(shopifyTokenExpire));
  const expiresInSeconds = Math.abs(expiresDate.getTime());

  const needRefresh = expiresInSeconds < secondsNow - 60 * 60 * 1000;

  if (needRefresh && shopifyToken) {
    const response = await getClient().storefront.customer.customerAccessTokenRenew({
      customerAccessToken: shopifyToken,
    });

    const token = response?.customerAccessToken?.accessToken;

    if (token) {
      shopifyToken = token;
      handleSetTokenCookies(token);
    } else {
      window.href = config.routes.login;
    }
  }

  return shopifyToken;
};
