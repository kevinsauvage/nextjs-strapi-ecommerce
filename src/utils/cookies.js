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
