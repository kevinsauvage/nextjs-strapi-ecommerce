// eslint-disable-next-line unicorn/filename-case
import { setCookie } from 'nookies';

import getClient from '@/shopify/index';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;

const expiresIn = 24 * 60 * 60;

const getToken = async (request, response) => {
  try {
    const { method } = request;

    if (method === 'GET') {
      const responseToken = await getClient().admin.customer.getDelegateToken({
        input: {
          delegateAccessScope: delegateAccessScope.split(','),
          expiresIn,
        },
      });

      if (!responseToken) {
        return response.status(500).json({ error: 'Could not get delegate access token' });
      }

      const delegateToken = responseToken?.delegateAccessToken?.accessToken;
      const errors = responseToken?.userErrors;

      if (errors.length > 0) {
        console.error(errors);
      }

      if (!delegateToken) {
        return response.status(500).json({ error: 'Could not get delegate access token' });
      }

      setCookie({ response }, 'shopifyDelegateToken', delegateToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: expiresIn,
        path: '/',
      });

      return response.status(200).json({ ok: true });
    }
    return response.status(500).json({ message: 'Method not allowed' });
  } catch (error) {
    return response.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default getToken;
