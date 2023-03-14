export const nextApiHelper = async (url, body = {}, method = 'POST') => {
  try {
    const object = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (body) object.body = JSON.stringify(body);
    const res = await fetch(url, object);
    return res?.json();
  } catch (err) {
    return console.error(err);
  }
};

export const generateDelegateToken = () => nextApiHelper('/api/delegateToken', null, 'GET');

export const sendMail = async (body) => {
  const apiUrl = '/api/email';
  return nextApiHelper(apiUrl, body, 'POST');
};
