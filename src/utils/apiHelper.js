const apiHelper = async (url, body = {}, method = 'POST', token) => {
  const object = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) object.body = JSON.stringify(body);
  if (token) object.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, object);
  if (res && res.status !== 200) throw new Error(res.status);
  const result = res && (await res.json());
  const { error, data } = result;
  if (error) throw error;
  if (data) return data;
  return result;
};

export default apiHelper;
