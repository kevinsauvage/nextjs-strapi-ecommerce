import {
  updateAddress,
  getCustomerAddressById,
  deleteAddressById,
} from '@/lib/shopify/customer/customerApiCall';
import { getInfoFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  try {
    const { method, query } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    const token = shopifyToken?.token;
    const addressId = query?.addressId;

    if (!token)
      return res.status(404).json({ message: 'Missing customer token cookie' });

    if (!addressId)
      return res.status(400).json({ message: 'Missing addressId param' });

    const id = decodeURIComponent(addressId);

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

        if (updatedAddress) return res.status(200).json(updatedAddress);
        return res.status(500).json({ message: 'Something went wrong' });
      }

      case 'DELETE': {
        const deleteRes = await deleteAddressById(token, id, delegateToken, ip);
        if (deleteRes) return res.json(deleteRes);
        return res.status(404).json({ message: "Couldn't delete address" });
      }

      default:
        return res.status(500).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
