const apiCall = async (url, method = 'GET', body) => {
  const object = {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    method,
    body: JSON.stringify(body),
  };

  const res = await fetch(url, object);
  console.log(res, 'ressss');

  if (res && res.ok) {
    const data = await res.json();
    console.log(data, 'daataaaa');
    return data;
  }
  return console.error(`Failed to fetch ${url}`);
};

export default apiCall;
