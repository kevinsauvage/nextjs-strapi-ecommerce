import { useEffect, useState } from 'react';

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
