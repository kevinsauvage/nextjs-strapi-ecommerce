import { parseCookies } from 'nookies';
import { getIpFromRequest } from '@/helpers/index';
import { searchProducts } from '@/lib/shopify/product/productApiCall';

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    if (method === 'GET') {
      const parsedCookies = parseCookies({ req });
      const { searchTerm } = query || {};
      if (!searchTerm) return res.status(400).json({ message: 'Missing search term' });
      const delegateToken = parsedCookies?.shopifyDelegateToken;
      const ip = getIpFromRequest(req);
      const searchResponse = await searchProducts(`${searchTerm}*`, delegateToken, ip);
      return res.status(200).json(searchResponse);
    }

    return res.status(500).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}
