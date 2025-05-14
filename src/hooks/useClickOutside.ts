import type { RefObject } from 'react';
import { useEffect } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

const useOnClickOutside = (reference: RefObject<HTMLElement>, handler: Handler) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !reference.current ||
        !(event.target instanceof Node) ||
        reference.current.contains(event.target)
      )
        return;
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
