import {
  registerCustomer,
  loginCustomer,
} from '@/lib/shopify/customer/customerApiCall';
import { parseCookies } from 'nookies';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { getIpFromRequest } from '@/helpers/index';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Missing body params Missing');

    const parsedCookies = parseCookies({ req });
    const delegateToken = parsedCookies?.shopifyDelegateToken;
    const ip = getIpFromRequest(req);

    const data = await registerCustomer({ email, password }, delegateToken, ip);

    if (!data) {
      const error = new Error();
      error.message = 'Something went wrong registering customer';
      error.status = 404;
      throw error;
    }

    const { customer, userErrors } = data || {};

    if (customer?.id) {
      const dataLogin = await loginCustomer(
        { email, password },
        delegateToken,
        ip
      );

      const accessToken = dataLogin?.customerAccessToken?.accessToken;

      handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);

      return res.status(200).json({
        ok: true,
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
