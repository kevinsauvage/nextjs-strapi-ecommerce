import { getDelegateToken } from '@/lib/shopify/customer/customerApiCall';
import { parseCookies, setCookie } from 'nookies';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;

const expiresIn = 12 * 60 * 60;

const getToken = async (req, res) => {
  try {
    const parsedCookies = parseCookies({ req });

    const delegateTokenSaved = parsedCookies?.shopify_delegate_token;

    if (delegateTokenSaved) {
      console.log('return >>>> delegate token already saved');
      return res.status(200).json({ ok: true });
    }

    console.log('Create delegate token >>> Not saved yet');
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
      maxAge: expiresIn,
      path: '/',
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default getToken;
