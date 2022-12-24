import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { updateDefaultAddress } from '@/lib/shopify/customer/customerApiCall';

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
      res.status(404).json({ message: 'Missing customer token cookie' });

    switch (method) {
      case 'PUT':
        {
          const { addressId } = req.body;

          if (!addressId) {
            res.status(400).send({ message: 'Missing query parameter' });
          }

          const updateResponse = await updateDefaultAddress(
            token,
            addressId,
            delegateToken,
            ip
          );

          if (updateResponse) {
            res.status(200).json(updateResponse);
          } else res.status(500).json('Something went wrong');
        }
        break;

      default:
        res.status(500).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
