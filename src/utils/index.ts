'use server';

import { cookies } from 'next/headers';

import config from '@/config';

export const getCurrentUrl = async () => {
  const cookiesStore = await cookies();
  return cookiesStore.get(config.cookies.url)?.value;
};

export const getCurrentUrlWithoutParameters = async () => {
  const cookiesStore = await cookies();
  return cookiesStore.get(config.cookies.url)?.value?.split('?')[0];
};

export const getCurrentSearchParameters = async () => {
  const cookiesStore = await cookies();
  const currentURL = new URL(cookiesStore.get(config.cookies.url)?.value || '');
  return currentURL.searchParams;
};

export const getCurrentPathname = async () => {
  const cookiesStore = await cookies();
  const currentURL = new URL(cookiesStore.get(config.cookies.url)?.value || '');
  return currentURL.pathname;
};

export const getCurrentOrigin = async () => {
  const cookiesStore = await cookies();
  const cookieUrl = cookiesStore.get(config.cookies.url)?.value;
  if (!cookieUrl) return;
  const currentURL = new URL(cookieUrl);
  return currentURL.origin;
};

/* eslint-disable no-param-reassign */
function processHtml(html: string) {
  // remove all style attributes
  if (!html) return '';

  html = html.replace(/style="[^"]*"/g, '');

  // remove <br> tags
  html = html.replace(/<br[^>]*>/g, '');

  // remove <img> tags
  html = html.replace(/<img[^>]*>/g, '');

  // remove comments
  html = html.replace(/<!--[^>]*-->/g, '');

  // remove scripts
  html = html.replace(/<script[^>]*>[^<]*<\/script>/g, '');

  // remove link tags
  return html.replace(/<link[^>]*>/g, '');
}

export default processHtml;
