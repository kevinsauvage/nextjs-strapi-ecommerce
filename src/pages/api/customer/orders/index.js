import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { getUserOrders } from '@/lib/shopify/customer/customerApiCall';

const getInfoFromRequest = (req) => {
  const parsedCookies = parseCookies({ req });

  const delegateToken = parsedCookies?.shopifyDelegateToken;
  const ip = getIpFromRequest(req);

  const shopifyTokenCookie = parsedCookies?.shopifyToken;

  const shopifyToken = shopifyTokenCookie
    ? JSON.parse(shopifyTokenCookie)
    : null;

  return { shopifyToken, delegateToken, ip };
};

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    const token = shopifyToken?.token;

    if (!token)
      return res.status(404).json({ message: 'Missing customer token cookie' });

    switch (method) {
      case 'GET': {
        const response = await getUserOrders(token, delegateToken, ip);

        const orders = response?.customer?.orders || null;
        if (orders) return res.status(200).json(orders);
        return res.status(500).json({ message: 'Something went wrong' });
      }

      default:
        return res.status(500).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
