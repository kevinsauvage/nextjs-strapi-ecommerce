import {
  registerCustomer,
  loginCustomer,
} from '@/lib/shopify/customer/customerApiCall';
import { setCookie } from 'nookies';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Missing body params Missing');

    const data = await registerCustomer({ email, password });

    if (!data) {
      const error = new Error();
      error.message = 'Something went wrong registering customer';
      error.status = 404;
      throw error;
    }

    const { customer, userErrors } = data || {};

    if (customer?.id) {
      const dataLogin = await loginCustomer({ email, password });
      const accessToken = dataLogin?.customerAccessToken?.accessToken;

      setCookie({ res }, 'shopify_token', accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 12 * 60 * 60,
        path: '/',
      });

      return res.status(200).json({
        ok: true,
        accessToken,
        userErrors,
        customer,
      });
    }
    return res.status(201).send({ ok: true, error: 'No content' });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default register;
