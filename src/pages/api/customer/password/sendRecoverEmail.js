import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { sendRecoverEmail } from '@/lib/shopify/customer/customerApiCall';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const { body } = req;
      const { email } = body;

      if (!email) {
        return res.status(400).json({
          name: 'Missing email in body',
          message: 'Email is required',
        });
      }

      const parsedCookies = parseCookies({ req });
      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);
      const emailRes = await sendRecoverEmail(email, delegateToken, ip);

      console.log(emailRes, 'emailRes: ');
      return res.status(200).json(emailRes);
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
  return res.status(500).json({ message: 'Method not allowed' });
}
