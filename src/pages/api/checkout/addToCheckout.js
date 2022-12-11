import { parseCookies } from 'nookies';
import { addLinesToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { getIpFromRequest } from '@/helpers/index';

const checkoutCookiesName = 'shopifyCheckoutId';

export default async function handler(req, res) {
  try {
    const { method, body } = req;

    if (method === 'POST') {
      const parsedCookies = parseCookies({ req });
      const checkoutId = parsedCookies?.[checkoutCookiesName];

      if (!checkoutId) {
        return res
          .status(400)
          .json({ message: 'Missing checkout ID in cookies' });
      }

      const { quantity, variantId } = body || {};
      if (!quantity || !variantId) {
        return res.status(400).json({ message: 'Missing query parameter' });
      }
      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);

      const lineItemsToAdd = [
        {
          variantId,
          quantity: parseInt(quantity, 10),
        },
      ];

      const addLineResponse = await addLinesToCheckout(
        checkoutId,
        lineItemsToAdd,
        delegateToken,
        ip
      );

      return res.status(200).json(addLineResponse);
    }
    return res.status(500).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
