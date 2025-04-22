'use server';

import config from '@/config';
import { adminSdk } from '@/shopify';

import { getCookieAction, setCookieAction } from './cookiesActions';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;
const expiresIn = 24 * 60 * 60;
const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;

export const setDelegateTokenAction = async () => {
  const tokenCookie = await getCookieAction(config.cookies.delegateToken);
  if (tokenCookie?.value) return;

  try {
    const responseToken = await adminSdk().delegateAccessTokenCreate({
      input: {
        delegateAccessScope: delegateAccessScope.split(','),
        expiresIn,
      },
    });

    const { delegateAccessToken, userErrors } = responseToken?.delegateAccessTokenCreate || {};

    if (userErrors?.length > 0) {
      console.error(userErrors);
    }

    if (delegateAccessToken) {
      await setCookieAction(config.cookies.delegateToken, delegateAccessToken.accessToken, {
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : domain,
        httpOnly: true,
        maxAge: expiresIn,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV !== 'development',
      });

      return delegateAccessToken;
    }
  } catch (error) {
    console.error('Error creating delegate access token:', JSON.stringify(error, undefined, 2));
    return;
  }
};
