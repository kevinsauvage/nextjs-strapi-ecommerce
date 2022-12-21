import { useEffect } from 'react';

/**
 * It adds an event listener to the document that listens for a mousedown or touchstart event. If the
 * event target is not the ref's current element or a descendent of it, then the handler is called
 * @param ref - The ref of the element you want to detect clicks outside of.
 * @param handler - The function to call when the user clicks outside of the ref element.
 */
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
