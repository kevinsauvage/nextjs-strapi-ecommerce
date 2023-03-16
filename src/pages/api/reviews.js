import getClient from '@/shopify/index';

const handle = async (request, response) => {
  try {
    const { method, body } = request;

    if (method === 'POST') {
      const { metafields } = body || {};

      const responseMetafield = await getClient().admin.customer.metafieldsSet({ metafields });

      if (!responseMetafield) {
        return response.status(500).json({ error: 'Could not set review' });
      }

      const errors = responseMetafield?.userErrors;

      if (errors?.length > 0) {
        return console.error(errors);
      }

      const value = responseMetafield?.metafields?.filter((field) => field.key === 'reviews')?.[0]?.value;

      const parsed = value ? JSON.parse(value) : undefined;

      if (parsed) return response.status(200).json({ ok: true, responseMetafield: parsed });
      return response.status(404).json({ ok: false, responseMetafield: undefined });
    }
    return response.status(500).json({ message: 'Method not allowed' });
  } catch (error) {
    return response.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default handle;
