import {
  updateAddress,
  getCustomerAddressById,
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
    const { method, query } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    const token = shopifyToken?.token;
    const addressId = query?.addressId;
    const id = `gid://shopify/MailingAddress/${addressId}?model_name=${query.model_name}&customer_access_token=${query.customer_access_token}`;

    if (!token)
      return res.status(404).json({ message: 'Missing customer token cookie' });

    if (!addressId)
      return res.status(400).json({ message: 'Missing addressId param' });

    switch (method) {
      case 'GET': {
        const responseAddress = await getCustomerAddressById(
          token,
          id,
          delegateToken,
          ip
        );

        if (responseAddress) return res.status(200).json(responseAddress);
        return res.status(500).json('Something went wrong');
      }

      case 'PUT': {
        const { address } = req.body;

        if (!address) {
          return res.status(400).send({ message: 'Missing query parameter' });
        }

        const updatedAddress = await updateAddress(
          address,
          token,
          id,
          delegateToken,
          ip
        );

        if (updatedAddress) {
          return res.status(200).json(updatedAddress);
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
