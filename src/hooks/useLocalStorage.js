import { useEffect, useState } from 'react';

// Hook
function useLocalStorage(key) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState();

  useEffect(() => {
    // Get from local storage by key
    const itemStr = window.localStorage.getItem(key);

    if (itemStr && itemStr !== 'undefined') {
      const item = JSON.parse(itemStr);

      const now = new Date();

      if (item?.expiryTime && now.getTime() > item.expiryTime * 1000) {
        localStorage.removeItem(key);
        setStoredValue(undefined);
      } else {
        setStoredValue(item);
      }
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value, ttl) => {
    // Save state

    const now = new Date();

    if (ttl) {
      setStoredValue({ value, expiryTime: now.getTime() + ttl });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          key,
          JSON.stringify({ value, expiryTime: now.getTime() + ttl })
        );
      }
      return;
    }

    setStoredValue(value);

    // Save to local storage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const getValue = (getKey) => {
    let returnValue = '';
    const itemStr = window.localStorage.getItem(getKey);

    if (itemStr && itemStr !== 'undefined') {
      const item = JSON.parse(itemStr);

      const now = new Date();

      if (item?.expiryTime && now.getTime() > item.expiryTime * 1000) {
        localStorage.removeItem(getKey);
        returnValue = null;
      }
      returnValue = item;
    }
    return returnValue;
  };
  const removeValue = () => {
    setStoredValue(undefined);
    localStorage.removeItem(key);
  };
  return [storedValue, setValue, getValue, removeValue];
}

export default useLocalStorage;
