import { parseCookies, setCookie } from 'nookies';
import {
  createCheckout,
  getCheckoutById,
} from '@/lib/shopify/checkout/checkoutApiCall';
import { getIpFromRequest } from '@/helpers/index';

const expiresIn = 24 * 60 * 60;
const checkoutCookiesName = 'shopifyCheckoutId';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    try {
      let checkout;
      const parsedCookies = parseCookies({ req });

      const shopifyCheckoutId = parsedCookies?.shopifyCheckoutId;
      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);

      if (shopifyCheckoutId) {
        const getCheckoutRes = await getCheckoutById(
          shopifyCheckoutId,
          delegateToken,
          ip
        );

        checkout = getCheckoutRes.checkout;

        if (res?.checkout?.orderStatusUrl) {
          const createCheckoutRes = await createCheckout({}, delegateToken, ip);
          checkout = createCheckoutRes?.checkout;
        }
      } else {
        const input = {};
        input.allowPartialAddresses = false;

        const createCheckoutRes = await createCheckout(
          input,
          delegateToken,
          ip
        );

        checkout = createCheckoutRes?.checkout;
      }

      if (checkout?.id) {
        setCookie({ res }, checkoutCookiesName, checkout.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: expiresIn,
          path: '/',
        });
      }

      return res.status(200).json({ checkout });
    } catch (error) {
      return res.status(500).json({ message: 'Could not create checkout' });
    }
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
