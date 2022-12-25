import { getInfoFromRequest } from '@/helpers/index';
import { getOrderById } from '@/lib/shopify/customer/customerApiCall';

export default async function handler(req, res) {
  try {
    const { method, query } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    const token = shopifyToken?.token;

    if (!token)
      return res.status(404).json({ message: 'Missing customer token cookie' });

    const orderId = query?.orderId;

    if (!orderId)
      return res.status(404).json({ message: 'Missing orderId param' });

    const id = `gid://shopify/Order/${query.orderId}?key=${query.key}`;

    switch (method) {
      case 'GET': {
        const orderRes = await getOrderById(id, delegateToken, ip);
        if (orderRes) return res.status(200).json(orderRes);
        return res.status(500).json({ message: 'Something went wrong' });
      }

      default:
        return res.status(500).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
