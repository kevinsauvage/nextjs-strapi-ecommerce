import { handleSetCookies } from '@/helpers/cookies';

const handler = async (req, res) => {
  try {
    const { method, body } = req;

    switch (method) {
      case 'POST': {
        const { cookie, name, expireIn } = body;

        if (!cookie || !name) throw new Error('Missing parameter');
        handleSetCookies(res, name, cookie, expireIn);
        return res.status(200).json({ ok: true });
      }

      default: {
        return res.status(500).json({ message: 'Method Not Allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export default handler;
