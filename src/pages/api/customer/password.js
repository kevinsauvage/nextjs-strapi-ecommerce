import {
  resetCustomerPassword,
  sendRecoverEmail,
} from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';

import { getInfoFromRequest } from '@/helpers/index';

export default async function handler(req, res) {
  try {
    const { method, query, body } = req;
    const { delegateToken, ip } = getInfoFromRequest(req);

    switch (method) {
      case 'GET': {
        const { password, url } = query;

        if (!password || password.length < 8 || !url) {
          return res.status(400).json({
            name: 'Bad Request',
            message: 'Password and URL required',
          });
        }

        const resetRes = await resetCustomerPassword(
          password,
          url,
          delegateToken,
          ip
        );

        const accessToken = resetRes?.customerAccessToken;
        const customerUserErrors = resetRes?.customerUserErrors;

        if (accessToken) {
          handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);
          return res.status(200).json({ customerUserErrors, ok: true });
        }
        return res.status(500).json({ message: 'Could not update password' });
      }

      case 'POST': {
        const { email } = body;

        if (!email) {
          return res.status(400).json({
            name: 'Missing email in body',
            message: 'Email is required',
          });
        }

        const emailRes = await sendRecoverEmail(email, delegateToken, ip);
        return res.status(200).json(emailRes);
      }

      default: {
        return res.status(400).json({ error: 'Method not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
