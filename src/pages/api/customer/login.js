import { loginCustomer, getUser } from '@/lib/shopify/customer/customerApiCall';
import { parseCookies, setCookie } from 'nookies';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Access token Missing');

    // Notice how the request object is passed
    const parsedCookies = parseCookies({ req });

    const delegateToken = parsedCookies?.shopify_delegate_token;

    const data = await loginCustomer({ email, password }, delegateToken);

    const { customerAccessToken, customerUserErrors } = data || {};

    if (customerAccessToken) {
      const { accessToken } = customerAccessToken || {};
      const { customer } = (await getUser(accessToken, delegateToken)) || {};

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

    return res.status(500).json({ ok: false });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default login;
