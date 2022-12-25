import { removeLinesFromCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { getInfoFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  try {
    const { method, body } = req;

    switch (method) {
      case 'POST': {
        const { delegateToken, ip, checkoutId } = getInfoFromRequest(req);

        if (!checkoutId) {
          return res
            .status(400)
            .json({ message: 'Missing checkout ID in cookies' });
        }

        const { lineItemId } = body || {};

        if (!lineItemId) {
          return res.status(400).json({ message: 'Missing query parameter' });
        }

        const removeLinesRes = await removeLinesFromCheckout(
          checkoutId,
          [lineItemId],
          delegateToken,
          ip
        );

        return res.status(200).json(removeLinesRes);
      }

      default: {
        return res.status(400).json({ error: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
