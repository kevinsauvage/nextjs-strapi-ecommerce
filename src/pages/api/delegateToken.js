import { setCookie } from 'nookies';
import getClient from '@/shopify/index';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;

const expiresIn = 24 * 60 * 60;

const getToken = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET': {
        const response = await getClient().admin.getDelegateToken({
          input: {
            delegateAccessScope: delegateAccessScope.split(','),
            expiresIn,
          },
        });

        if (!response) {
          return res.status(500).json({ error: 'Could not get delegate access token' });
        }

        const delegateToken = response?.delegateAccessToken?.accessToken;
        const errors = response?.userErrors;

        if (errors.length > 0) {
          console.error(errors);
        }

        if (!delegateToken) {
          return res.status(500).json({ error: 'Could not get delegate access token' });
        }

        setCookie({ res }, 'shopifyDelegateToken', delegateToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: expiresIn,
          path: '/',
        });

        return res.status(200).json({ ok: true });
      }
      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default getToken;
