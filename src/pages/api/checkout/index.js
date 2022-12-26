import { setCookie } from 'nookies';
import {
  createCheckout,
  getCheckoutById,
  updateCheckoutShippingAddress,
} from '@/lib/shopify/checkout/checkoutApiCall';
import { getInfoFromRequest } from '@/helpers/index';

const expiresIn = 24 * 60 * 60;
const checkoutCookiesName = 'shopifyCheckoutId';

export default async function handler(req, res) {
  try {
    const { method, body } = req;
    const { delegateToken, ip, checkoutId } = getInfoFromRequest(req);

    switch (method) {
      case 'GET': {
        let checkout;

        if (checkoutId) {
          const getCheckoutRes = await getCheckoutById(
            checkoutId,
            delegateToken,
            ip
          );

          checkout = getCheckoutRes.checkout;

          if (res?.checkout?.orderStatusUrl) {
            const createCheckoutRes = await createCheckout(
              {},
              delegateToken,
              ip
            );
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
      }

      case 'PUT': {
        const { shippingAddress } = body;

        if (!shippingAddress || !checkoutId) {
          return res
            .status(500)
            .send({ message: 'Missing shipping address or checkout id' });
        }
        const resUpdate = await updateCheckoutShippingAddress(
          shippingAddress,
          checkoutId,
          delegateToken,
          ip
        );

        return res.json(resUpdate);
      }

      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
