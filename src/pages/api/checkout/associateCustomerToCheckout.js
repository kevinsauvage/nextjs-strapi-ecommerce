import { parseCookies } from 'nookies';
import { associateCustomerToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { getIpFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === 'GET') {
    const checkoutId = query?.checkout_id;

    if (!checkoutId) {
      return res.status(400).json({ message: 'Missing query parameter' });
    }

    const parsedCookies = parseCookies({ req });

    const shopifyTokenCookie = parsedCookies?.shopifyToken;

    const shopifyToken = shopifyTokenCookie
      ? JSON.parse(shopifyTokenCookie)
      : null;

    if (shopifyToken) {
      const delegateToken = parsedCookies?.shopifyDelegateToken;

      const ip = getIpFromRequest(req);

      const associateRes = await associateCustomerToCheckout(
        checkoutId,
        shopifyToken?.token,
        delegateToken,
        ip
      );

      return res.status(200).json(associateRes);
    }
    return res
      .status(201)
      .json({ ok: true, message: 'Customer not logged in' });
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
