import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { removeLinesFromCheckout } from '@/lib/shopify/checkout/checkoutApiCall';

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

      const { lineItemId } = body || {};

      console.log(body, 'body');

      if (!lineItemId) {
        return res.status(400).json({ message: 'Missing query parameter' });
      }
      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);

      const removeLinesRes = await removeLinesFromCheckout(
        checkoutId,
        [lineItemId],
        delegateToken,
        ip
      );

      return res.status(200).json(removeLinesRes);
    }
    return res.status(500).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
