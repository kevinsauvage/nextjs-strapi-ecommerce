import { useEffect } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;
type Reference = React.RefObject<HTMLElement>;

const useOnClickOutside = (reference: Reference, handler: Handler) => {
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
