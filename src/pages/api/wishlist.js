import getClient from '@/shopify/index';

const handle = async (req, res) => {
  try {
    const { method, body } = req;

    if (method === 'POST') {
      const { metafields } = body || {};

      const response = await getClient().admin.customer.metafieldsSet({ metafields });

      if (!response) {
        return res.status(500).json({ error: 'Could not set metafield' });
      }

      const errors = response?.userErrors;

      if (errors?.length > 0) {
        return console.error(errors);
      }

      const value = response?.metafields?.filter((field) => field.key === 'wishlist')?.[0]?.value;

      const parsed = value ? JSON.parse(value) : null;

      if (parsed) return res.status(200).json({ ok: true, response: parsed });
      return res.status(404).json({ ok: false, response: null });
    }
    return res.status(500).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default handle;
