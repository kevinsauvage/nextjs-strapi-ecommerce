const nextApiHelper = async (url, body = {}, method = 'POST') => {
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

export default nextApiHelper;
