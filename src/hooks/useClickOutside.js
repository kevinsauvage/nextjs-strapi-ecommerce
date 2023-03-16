import { useEffect } from 'react';

const useOnClickOutside = (reference, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!reference.current || reference.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [reference, handler]);
};

export default useOnClickOutside;
