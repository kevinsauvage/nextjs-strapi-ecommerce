'use server';

import config from '@/config';
import { safeLogError } from '@/lib/api-responses';
import { adminSdk } from '@/shopify';
import { getSecureCookieOptions } from '@/utils/cookie-security';

import { getCookieAction, setCookieAction } from './cookiesActions';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;
const expiresIn = config.constants.delegateTokenExpirySeconds;

export const setDelegateTokenAction = async (): Promise<void> => {
  const tokenCookie = await getCookieAction(config.cookies.delegateToken);
  if (tokenCookie?.value) return;

  if (!delegateAccessScope) {
    safeLogError('setDelegateTokenAction', new Error('SHOPIFY_SCOPE environment variable is not set'));
    throw new Error('SHOPIFY_SCOPE environment variable is required for delegate token creation');
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
      safeLogError('setDelegateTokenAction - user errors', userErrors);
    }

    if (delegateAccessToken) {
      await setCookieAction(
        config.cookies.delegateToken,
        delegateAccessToken.accessToken,
        getSecureCookieOptions({ maxAge: expiresIn }),
      );
    }
  } catch (error) {
    safeLogError('setDelegateTokenAction', error);
    throw error;
  }
};
