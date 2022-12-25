import { loginCustomer } from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { getInfoFromRequest } from '@/helpers/index';
import { associateCustomerToCheckout } from '@/lib/shopify/checkout/checkoutApiCall';

const login = async (req, res) => {
  try {
    const { method, body } = req;
    const { delegateToken, ip, checkoutId } = getInfoFromRequest(req);

    switch (method) {
      case 'POST': {
        const { email, password } = body;

        if (!email || !password) throw new Error('Access token Missing');

        const data = await loginCustomer(
          { email, password },
          delegateToken,
          ip
        );

        if (!data) return res.status(403).json({ error: 'Login call failed' });

        const { customerAccessToken, customerUserErrors } = data || {};

        if (customerUserErrors?.length) {
          return res.status(201).json({
            ok: true,
            customerUserErrors,
          });
        }

        const { accessToken } = customerAccessToken || {};

        if (accessToken && checkoutId) {
          handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);

          if (checkoutId) {
            associateCustomerToCheckout(
              checkoutId,
              accessToken,
              delegateToken,
              ip
            );
          }

          return res.status(200).json({ ok: true });
        }
        return res.status(500).send({ error: 'Internal Server Error' });
      }

      default: {
        return res.status(500).json({ message: 'Method Not Allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default login;
