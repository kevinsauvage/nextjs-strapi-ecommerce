import { parseCookies } from 'nookies';
import { associateCustomerToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { getIpFromRequest } from '@/helpers/index';

const checkoutCookiesName = 'shopifyCheckoutId';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const parsedCookies = parseCookies({ req });
    const checkoutId = parsedCookies?.[checkoutCookiesName];

    if (!checkoutId) {
      return res
        .status(400)
        .json({ message: 'Missing checkout ID in cookies' });
    }

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
