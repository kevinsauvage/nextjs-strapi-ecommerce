/* eslint-disable camelcase */
import { destroyCookie, parseCookies } from 'nookies';
import { deleteAccessToken } from '@/lib/shopify/customer/customerApiCall';

const logout = async (req, res) => {
  try {
    const parsedCookies = parseCookies({ req });
    const delegateToken = parsedCookies?.shopify_delegate_token;
    const shopify_token = parsedCookies?.shopify_token;

    if (shopify_token) {
      await deleteAccessToken(shopify_token, delegateToken);
    }

    destroyCookie({ res }, 'shopify_token', {
      path: '/',
    });

    res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
  }
};

export default logout;
