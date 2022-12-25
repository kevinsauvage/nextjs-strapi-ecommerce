import {
  getUser,
  refreshToken,
  updateUserInfo,
} from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { getInfoFromRequest } from '@/helpers/index';

const refreshDelay = 2 * 60 * 60;

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { shopifyToken, delegateToken, ip } = getInfoFromRequest(req);
    let token = shopifyToken?.token;

    if (!token) {
      return res.status(400).json({ message: 'Missing  shopify token' });
    }

    switch (method) {
      case 'GET': {
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
        const customer = userRes?.customer;
        return res.status(200).json({ customer, ok: true });
      }

      case 'PUT': {
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

        const data = await updateUserInfo(
          token,
          customerInput,
          delegateToken,
          ip
        );

        if (!data) {
          return res.status(404).sent({ message: 'Could not update user' });
        }

        const { customerAccessToken, customerUserErrors, customer } =
          data || {};

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

        return res.status(200).json({ customer, ok: true });
      }

      default: {
        return res.status(500).json({ message: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
