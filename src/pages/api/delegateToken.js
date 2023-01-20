import { getDelegateToken } from '@/lib/shopify/customer/customerApiCall';
import { setDelegateTokenCookie } from '@/helpers/cookies';

const delegateAccessScope = process.env.SHOPIFY_SCOPE;
const expiresIn = 24 * 60 * 60;

const getToken = async (req, res) => {
  if (!req || !res) {
    return res.status(500).json({ error: 'Missing required parameters' });
  }

  if (!delegateAccessScope) {
    return res.status(500).json({ error: 'Missing required environment variable: SHOPIFY_SCOPE' });
  }

  if (!expiresIn) {
    return res.status(500).json({ error: 'Missing required environment variable: TOKEN_EXPIRES_IN' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { delegateAccessToken, userErrors } = await getDelegateToken({
      delegateAccessScope: delegateAccessScope.split(','),
      expiresIn,
    });
    if (userErrors.length > 0) console.error(userErrors);

    if (!delegateAccessToken) {
      return res.status(500).json({ error: 'Could not get delegate access token' });
    }
    console.log('Setting delegate access token SUCCESS');
    setDelegateTokenCookie(res, delegateAccessToken);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default getToken;
