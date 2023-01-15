import { getUserOrders } from '@/lib/shopify/customer/customerApiCall';
import { getInfoFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    const token = shopifyToken?.token;

    if (!token) return res.status(404).json({ message: 'Missing customer token cookie' });

    switch (method) {
      case 'GET': {
        const response = await getUserOrders(token, delegateToken, ip);
        if (response) return res.status(200).json(response);
        return res.status(500).json({ message: 'Something went wrong' });
      }

      default:
        return res.status(500).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
