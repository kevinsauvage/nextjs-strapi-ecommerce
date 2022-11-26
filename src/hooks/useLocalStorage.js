import { useEffect, useState } from 'react';

// Hook
function useLocalStorage(key) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState();

  useEffect(() => {
    // Get from local storage by key
    const itemStr = window.localStorage.getItem(key);

    if (itemStr) {
      const item = JSON.parse(itemStr);
      console.log(item, `storage for key ${key}`);

      const now = new Date();

      if (item?.expiryTime) {
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiryTime * 1000) {
          // If the item is expired, delete the item from storage
          // and return null
          console.log('remove item expired');
          localStorage.removeItem(key);
        } else {
          setStoredValue(item);
        }
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
  return [storedValue, setValue];
}

export default useLocalStorage;
