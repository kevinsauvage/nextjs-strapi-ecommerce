export const nextApiHelper = async (url, body = {}, method = 'POST') => {
  try {
    const object = {
      headers: { 'Content-Type': 'application/json' },
      method,
    };

    if (body) object.body = JSON.stringify(body);
    const response = await fetch(url, object);
    return response?.json();
  } catch (error) {
    return console.error(error);
  }
};

export const generateDelegateToken = () => nextApiHelper('/api/delegate-token', '', 'GET');

export const sendMail = async (body) => {
  const apiUrl = '/api/email';
  return nextApiHelper(apiUrl, body, 'POST');
};
