import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { updateLines } from '@/lib/shopify/checkout/checkoutApiCall';

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

      const { id, quantity } = body || {};

      if (!id || !quantity) {
        return res.status(400).json({ message: 'Missing query parameter' });
      }
      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);

      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];

      const updateLinesRes = await updateLines(
        checkoutId,
        lineItemsToUpdate,
        delegateToken,
        ip
      );

      return res.status(200).json(updateLinesRes);
    }
    return res.status(500).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
