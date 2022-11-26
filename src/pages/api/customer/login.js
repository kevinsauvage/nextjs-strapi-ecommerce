import { loginCustomer, getUser } from '@/lib/shopify/customer/customerApiCall';
import { setCookie } from 'nookies';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Access token Missing');

    const data = await loginCustomer({ email, password });

    const { customerAccessToken, customerUserErrors } = data || {};

    if (customerAccessToken) {
      const { accessToken } = customerAccessToken || {};
      const { customer } = (await getUser(accessToken)) || {};

      setCookie({ res }, 'shopify_token', accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 12 * 60 * 60,
        path: '/',
      });

      return res.status(200).json({
        ok: true,
        accessToken,
        customerUserErrors,
        customer,
      });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default login;
