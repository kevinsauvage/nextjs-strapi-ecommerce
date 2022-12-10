import { getDelegateToken } from '@/lib/shopify/customer/customerApiCall';
import { setCookie } from 'nookies';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;

const expiresIn = 12 * 60 * 60;

const getToken = async (req, res) => {
  try {
    const response = await getDelegateToken({
      delegateAccessScope: delegateAccessScope.split(','),
      expiresIn,
    });

    if (!response) {
      return res.status(500).json({
        error: 'Could not get delegate access token',
      });
    }

    const delegateToken =
      response?.data?.delegateAccessTokenCreate?.delegateAccessToken
        ?.accessToken;

    if (!delegateToken) {
      return res.status(500).json({
        error: 'Could not get delegate access token',
      });
    }

    setCookie({ res }, 'shopify_delegate_token', delegateToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 12 * 60 * 60,
      path: '/',
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default getToken;
