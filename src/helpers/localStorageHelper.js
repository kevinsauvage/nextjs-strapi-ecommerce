const localStorageHelper = {
  getValue: (key) => {
    let returnValue = '';
    const itemStr = window.localStorage.getItem(key);

    if (itemStr && itemStr !== 'undefined') {
      const item = JSON.parse(itemStr);

      const now = new Date();

      if (item?.expiryTime && now.getTime() > item.expiryTime * 1000) {
        localStorage.removeItem(key);
        returnValue = null;
      }
      returnValue = item;
    }
    return returnValue;
  },

  setValue: (key, value, ttl) => {
    const now = new Date();

    if (ttl) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          key,
          JSON.stringify({ value, expiryTime: now.getTime() + ttl })
        );
      }
      return;
    }

    // Save to local storage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
};

export default localStorageHelper;
