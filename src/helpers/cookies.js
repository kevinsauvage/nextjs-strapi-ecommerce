/* eslint-disable import/prefer-default-export */
const { setCookie } = require('nookies');

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
    const expiresDate = new Date(new Date().getTime() + maxAge * 1000);
    const cookieValue = JSON.stringify({ expiresDate, value });

    const options = {
      httpOnly,
      secure: process.env.NODE_ENV !== NODE_ENV_DEVELOPMENT,
      sameSite: COOKIE_SAME_SITE,
      maxAge,
      path: '/',
    };

    setCookie({ res: response }, name, cookieValue, options);
  } catch (error) {
    console.error(`Error setting cookie: ${error}`);
    throw error;
  }
};

export const getCookieFront = (name) => {
  const cookies = document.cookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

export const setCookieFront = (cName, cValue, expDays = 1, secure = true, sameSite = 'Lax') => {
  if (typeof cName !== 'string' || typeof cValue !== 'string' || typeof expDays !== 'number') {
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
    document.cookie = cookie;
  } catch (error) {
    console.error(`Failed to set cookie: ${error}`);
  }
};
