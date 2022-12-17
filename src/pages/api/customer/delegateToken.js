import { getDelegateToken } from '@/lib/shopify/customer/customerApiCall';
import { parseCookies, setCookie } from 'nookies';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;

const expiresIn = 24 * 60 * 60;

const getToken = async (req, res) => {
  try {
    const parsedCookies = parseCookies({ req });

    const delegateTokenSaved = parsedCookies?.shopifyDelegateToken;

    if (delegateTokenSaved) {
      return res.status(200).json({ ok: true });
    }

    const response = await getDelegateToken({
      delegateAccessScope: delegateAccessScope.split(','),
      expiresIn,
    });

    if (!response) {
      return res.status(500).json({
        error: 'Could not get delegate access token',
      });
    }

    const delegateToken = response?.delegateAccessToken?.accessToken;
    const errors = response?.userErrors;

    if (errors.length > 0) {
      console.error(errors);
    }

    if (!delegateToken) {
      return res.status(500).json({
        error: 'Could not get delegate access token',
      });
    }

    setCookie({ res }, 'shopifyDelegateToken', delegateToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: expiresIn,
      path: '/',
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default getToken;
