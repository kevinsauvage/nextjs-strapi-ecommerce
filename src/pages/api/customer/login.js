import { parseCookies } from 'nookies';
import { loginCustomer, getUser } from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Access token Missing');

    const parsedCookies = parseCookies({ req });
    const delegateToken = parsedCookies?.shopifyDelegateToken;

    const data = await loginCustomer({ email, password }, delegateToken);
    const { customerAccessToken, customerUserErrors } = data || {};

    if (customerAccessToken) {
      const { accessToken } = customerAccessToken || {};
      const { customer } = (await getUser(accessToken, delegateToken)) || {};

      handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);

      return res.status(200).json({
        ok: true,
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
