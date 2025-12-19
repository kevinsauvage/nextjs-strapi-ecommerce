'use server';

import config from '@/config';
import { adminSdk } from '@/shopify';
import { getSecureCookieOptions } from '@/utils/cookie-security';

import { getCookieAction, setCookieAction } from './cookiesActions';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;
const expiresIn = config.constants.delegateTokenExpirySeconds;

export const setDelegateTokenAction = async (): Promise<void> => {
  const tokenCookie = await getCookieAction(config.cookies.delegateToken);
  if (tokenCookie?.value) return;

  if (!delegateAccessScope) {
    console.error('SHOPIFY_SCOPE environment variable is not set');
    return;
  }

  try {
    const responseToken = await adminSdk().delegateAccessTokenCreate({
      input: {
        delegateAccessScope: delegateAccessScope.split(','),
        expiresIn,
      },
    });

    const { delegateAccessToken, userErrors } = responseToken?.delegateAccessTokenCreate || {};

    if (userErrors && userErrors.length > 0) {
      console.error(userErrors);
    }

    if (delegateAccessToken) {
      await setCookieAction(
        config.cookies.delegateToken,
        delegateAccessToken.accessToken,
        getSecureCookieOptions({ maxAge: expiresIn }),
      );
    }
  } catch (error) {
    console.error('Error creating delegate access token:', JSON.stringify(error, undefined, 2));
    return;
  }
};
