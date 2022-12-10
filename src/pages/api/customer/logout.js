import { destroyCookie, parseCookies } from 'nookies';
import { deleteAccessToken } from '@/lib/shopify/customer/customerApiCall';

const logout = async (req, res) => {
  try {
    const parsedCookies = parseCookies({ req });

    const shopifyTokenCookie = parsedCookies?.shopifyToken;
    const delegateToken = parsedCookies?.shopifyDelegateToken;

    const shopifyToken = shopifyTokenCookie
      ? JSON.parse(shopifyTokenCookie)
      : null;

    if (shopifyToken) {
      await deleteAccessToken(shopifyToken?.token, delegateToken);
    }

    destroyCookie({ res }, 'shopifyToken', {
      path: '/',
    });

    res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
  }
};

export default logout;
