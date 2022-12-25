import { associateCustomerToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { getInfoFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET': {
        const { delegateToken, ip, checkoutId, shopifyToken } =
          getInfoFromRequest(req);

        if (!checkoutId) {
          return res
            .status(400)
            .json({ message: 'Missing checkout ID in cookies' });
        }

        if (!shopifyToken) {
          return res
            .status(400)
            .json({ message: 'Missing shopify token in cookies' });
        }

        const associateRes = await associateCustomerToCheckout(
          checkoutId,
          shopifyToken?.token,
          delegateToken,
          ip
        );

        if (!associateRes) {
          return res
            .status(400)
            .json({ message: 'Customer not associate to checkout' });
        }

        return res.status(200).json(associateRes);
      }
      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
