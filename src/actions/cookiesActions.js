'use server';

import { cookies } from 'next/headers';

export const delCookieAction = async (name) => {
  const cookieStore = await cookies();
  return cookieStore.delete(name);
};

export const getCookieAction = async (name) => {
  if (!name) {
    console.error('Cookie name is required');
    return;
  }
  const cookieStore = await cookies();
  return cookieStore.get(name);
};

export const setCookieAction = async (name, value, options) => {
  if (!name || !value) {
    console.error('Cookie name and value are required');
    return;
  }

  const cookieStore = await cookies();
  return cookieStore.set(name, value, options);
};
