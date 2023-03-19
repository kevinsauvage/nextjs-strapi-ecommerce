import { useEffect } from 'react';

function useHideScrollbar() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
}

export default useHideScrollbar;
