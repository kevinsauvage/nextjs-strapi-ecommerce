import { getInfoFromRequest } from '@/helpers/index';
import { getOrderById } from '@/lib/shopify/customer/customerApiCall';

export default async function handler(req, res) {
  try {
    const { method, query } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    const token = shopifyToken?.token;

    if (!token)
      return res.status(404).json({ error: 'Missing customer token cookie' });

    const orderId = query?.id;

    if (!orderId)
      return res.status(404).json({ error: 'Missing orderId param' });

    switch (method) {
      case 'GET': {
        const orderRes = await getOrderById(orderId, delegateToken, ip);
        if (orderRes) return res.status(200).json(orderRes);
        return res.status(500).json({ error: 'Internal server error' });
      }

      default:
        return res.status(500).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
