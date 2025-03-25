'use server';

import config from '@/config';
import getClient from '@/shopify';

import { getCookieAction, setCookieAction } from './cookiesActions';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;
const expiresIn = 24 * 60 * 60;
const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;

export const setDelegateTokenAction = async () => {
  const tokenCookie = await getCookieAction(config.cookies.delegateToken);
  if (tokenCookie?.value) return;

  const responseToken = await getClient().admin.customer.getDelegateToken({
    input: {
      delegateAccessScope: delegateAccessScope.split(','),
      expiresIn,
    },
  });

  const delegateToken = responseToken?.delegateAccessToken?.accessToken;

  if (delegateToken) {
    setCookieAction(config.cookies.delegateToken, delegateToken, {
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : domain,
      httpOnly: true,
      maxAge: expiresIn,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV !== 'development',
    });

    return delegateToken;
  }

  const errors = responseToken?.userErrors;

  if (errors?.length > 0) {
    console.error(errors);
  }
};
