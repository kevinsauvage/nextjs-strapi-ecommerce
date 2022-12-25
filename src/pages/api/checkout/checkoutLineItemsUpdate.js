import { updateLines } from '@/lib/shopify/checkout/checkoutApiCall';
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

        const { id, quantity } = body || {};

        if (!id || !quantity) {
          return res.status(400).json({ message: 'Missing query parameter' });
        }

        const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];

        const updateLinesRes = await updateLines(
          checkoutId,
          lineItemsToUpdate,
          delegateToken,
          ip
        );

        return res.status(200).json(updateLinesRes);
      }

      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
