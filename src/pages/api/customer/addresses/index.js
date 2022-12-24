import {
  getCustomerAddresses,
  createAddress,
} from '@/lib/shopify/customer/customerApiCall';
import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';

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
        const addresses = await getCustomerAddresses(token, delegateToken, ip);

        if (addresses) return res.status(200).json(addresses);
        return res.status(500).json('Something went wrong');
      }

      case 'POST': {
        const { address } = req.body;

        if (!address) {
          return res.status(400).send({ message: 'Missing query parameter' });
        }

        const createdAddress = await createAddress(
          address,
          token,
          delegateToken,
          ip
        );

        if (createdAddress) {
          return res.status(200).json(createdAddress);
        }
        return res.status(500).json('Something went wrong');
      }

      default:
        return res.status(500).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
