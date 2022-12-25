import {
  getUser,
  refreshToken,
  updateUserInfo,
} from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { getInfoFromRequest } from '@/helpers/index';

const refreshDelay = 2 * 60 * 60;

export default async function handler(req, res) {
  const { method } = req;
  const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
  let token = shopifyToken?.token;

  if (method === 'GET') {
    if (shopifyToken) {
      const expires = new Date(shopifyToken.expires).getTime();
      const now = new Date().getTime();

      if (now > expires - refreshDelay) {
        const refreshRes = await refreshToken(token, delegateToken, ip);
        const accessToken = refreshRes?.customerAccessToken?.accessToken;

        if (accessToken) {
          token = accessToken;
          handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);
        }
      }

      const userRes = (await getUser(token, delegateToken, ip)) || {};
      console.log('🚀 ~ file: customer.js:28 ~ handler ~ userRes', userRes);
      const customer = userRes?.customer;
      return res.status(200).json({ customer, ok: true });
    }
  }
  if (method === 'PUT') {
    const d = new Date();

    console.log(`request receivd==>>>>>>>${d.toLocaleTimeString()}`);
    if (token) {
      const {
        body: {
          email,
          password,
          firstName,
          lastName,
          phone,
          acceptsMarketing = true,
        },
      } = req;

      if (!email || !password || !firstName || !lastName) {
        return res
          .status(400)
          .json({ error: 'Bad request', message: 'Missing body parameter' });
      }

      const customerInput = {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing,
      };

      if (phone) customerInput.phone = phone;

      console.log(`Call update ==>>>>>>>${d.toLocaleTimeString()}`);

      const data = await updateUserInfo(
        token,
        customerInput,
        delegateToken,
        ip
      );
      console.log(`Received response ==>>>>>>>${d.toLocaleTimeString()}`);

      if (!data) {
        return res.status(404).sent({ message: 'Could not update user' });
      }

      const { customerAccessToken, customerUserErrors, customer } = data || {};

      if (customerUserErrors?.length) {
        return res.status(201).json({
          ok: true,
          customerUserErrors,
        });
      }

      if (customerAccessToken) {
        handleSetShopifyTokenCookies(
          res,
          'shopifyToken',
          customerAccessToken?.accessToken
        );
      }
      console.log(`Sending response ==>>>>>>>${d.toLocaleTimeString()}`);

      return res.status(200).json({ customer, ok: true });
    }
    return res
      .status(400)
      .json({ ok: false, message: 'Missing  shopify token' });
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
