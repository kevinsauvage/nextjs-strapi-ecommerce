import { destroyCookie } from 'nookies';
import { deleteAccessToken } from '@/lib/shopify/customer/customerApiCall';
import { getInfoFromRequest } from '@/helpers/index';

const logout = async (req, res) => {
  try {
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);

    if (shopifyToken) await deleteAccessToken(shopifyToken?.token, delegateToken, ip);

    destroyCookie({ res }, 'shopifyToken', { path: '/' });

    return res.status(200).send({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default logout;
