import {
  updateLines,
  removeLinesFromCheckout,
} from '@/lib/shopify/checkout/checkoutApiCall';
import { getInfoFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  try {
    const { method, body, query } = req;
    const { delegateToken, ip, checkoutId } = getInfoFromRequest(req);

    if (!checkoutId) {
      return res
        .status(400)
        .json({ message: 'Missing checkout ID in cookies' });
    }
    const lineId = decodeURIComponent(query.lineId);

    if (!lineId) {
      return res.status(400).json({ message: 'Missing line id URL parameter' });
    }

    switch (method) {
      case 'PUT': {
        const { quantity } = body || {};

        if (!quantity) {
          return res.status(400).json({ message: 'Missing query parameter' });
        }

        const lineItemsToUpdate = [
          { id: lineId, quantity: parseInt(quantity, 10) },
        ];

        const updateLinesRes = await updateLines(
          checkoutId,
          lineItemsToUpdate,
          delegateToken,
          ip
        );

        return res.status(200).json(updateLinesRes);
      }

      case 'DELETE': {
        const removeLinesRes = await removeLinesFromCheckout(
          checkoutId,
          [lineId],
          delegateToken,
          ip
        );

        return res.status(200).json(removeLinesRes);
      }

      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
