import { useEffect } from 'react';

function useHideScrollbar() {
  useEffect(() => {
    // Get the original body overflow value
    const originalOverflow = document.body.style.overflow;

    // Hide the scrollbar
    document.body.style.overflow = 'hidden';

    // Restore the original body overflow value on cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
}

export default useHideScrollbar;
