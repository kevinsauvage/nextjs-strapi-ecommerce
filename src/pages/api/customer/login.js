import { parseCookies } from 'nookies';
import { loginCustomer, getUser } from '@/lib/shopify/customer/customerApiCall';
import { handleSetShopifyTokenCookies } from '@/helpers/cookies';
import { getIpFromRequest } from '@/helpers/index';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error('Access token Missing');

    const parsedCookies = parseCookies({ req });
    const delegateToken = parsedCookies?.shopifyDelegateToken;
    const ip = getIpFromRequest(req);

    const data = await loginCustomer({ email, password }, delegateToken, ip);
    const { customerAccessToken, customerUserErrors } = data || {};

    if (customerUserErrors.length) {
      return res.status(201).json({
        ok: true,
        customerUserErrors,
      });
    }

    if (customerAccessToken) {
      const { accessToken } = customerAccessToken || {};
      const response = await getUser(accessToken, delegateToken, ip);
      const customer = response?.customer;

      console.log(response);
      handleSetShopifyTokenCookies(res, 'shopifyToken', accessToken);

      return res.status(200).json({
        ok: true,
        customer,
      });
    }

    return res.status(500).json({ ok: false });
  } catch (error) {
    return res.status(404).send({ ok: false, error });
  }
};

export default login;
