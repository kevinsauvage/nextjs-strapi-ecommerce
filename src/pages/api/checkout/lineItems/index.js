import { getInfoFromRequest } from '@/helpers/index';
import { addLinesToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';

export default async function handler(req, res) {
  try {
    const { method, body } = req;
    const { delegateToken, ip, checkoutId } = getInfoFromRequest(req);

    if (!checkoutId) {
      return res
        .status(400)
        .json({ message: 'Missing checkout ID in cookies' });
    }

    switch (method) {
      case 'POST': {
        const { quantity, variantId } = body || {};

        if (!quantity || !variantId) {
          return res.status(400).json({ message: 'Missing query parameter' });
        }

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

      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
