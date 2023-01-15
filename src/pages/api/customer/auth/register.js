import { registerCustomer, loginCustomer } from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { associateCustomerToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';
import { getInfoFromRequest } from '@/helpers/index';

const register = async (req, res) => {
  try {
    const { method, body } = req;
    const { delegateToken, ip, checkoutId } = getInfoFromRequest(req);

    switch (method) {
      case 'POST': {
        const { email, password } = body;

        if (!email || !password) throw new Error('Access token Missing');

        const data = await registerCustomer({ email, password }, delegateToken, ip);

        if (!data) {
          const error = new Error();
          error.message = 'Something went wrong registering customer';
          error.status = 404;
          throw error;
        }

        const { userErrors } = data || {};

        if (userErrors.length) return res.status(200).json({ userErrors });

        const dataLogin = await loginCustomer({ email, password }, delegateToken, ip);

        const accessToken = dataLogin?.customerAccessToken?.accessToken;

        if (!accessToken) return res.status(403).send({ message: 'Login failed' });

        handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);

        if (checkoutId) associateCustomerToCheckout(checkoutId, accessToken, delegateToken, ip);

        return res.status(200).json({ ok: true });
      }
      default:
        return res.status(500).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default register;
