import { useEffect, useState } from 'react';

/**
 * It returns a boolean value that indicates whether the element is visible on the screen or not
 * @param ref - The ref of the element you want to observe.
 * @returns The isIntersecting state.
 */
export default function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    let observer = null;
    if (ref.current) {
      observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      );
      observer.observe(ref.current);
    }
    return () => {
      observer?.disconnect();
    };
    // Remove the observer as soon as the component is unmounted
  }, [ref]);

  return isIntersecting;
}
