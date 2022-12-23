import { updateAddress } from '@/lib/shopify/customer/customerApiCall';
import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  const { method } = req;
  console.log('🚀 ~ file: addresses.js:7 ~ handler ~ method', method);

  if (method === 'PUT') {
    try {
      const { address, id } = req.body;
      const parsedCookies = parseCookies({ req });

      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);

      const shopifyTokenCookie = parsedCookies?.shopifyToken;

      const shopifyToken = shopifyTokenCookie
        ? JSON.parse(shopifyTokenCookie)
        : null;

      const updatedAddress = await updateAddress(
        address,
        shopifyToken.token,
        id,
        delegateToken,
        ip
      );
      console.log(
        '🚀 ~ file: addresses.js:30 ~ handler ~ updatedAddress',
        updatedAddress
      );

      res.status(200).json({ address: updatedAddress });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
