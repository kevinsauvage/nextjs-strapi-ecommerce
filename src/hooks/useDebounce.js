const { useEffect, useState } = require('react');

/**
 * UseDebounce returns a debounced value. It will only update the debounced value after the specified
 * delay, and if the value has changed.
 * @param value - The value to pass through the debounce.
 * @param delay - The delay in milliseconds for the debounce.
 * @returns The debounced value.
 */
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export default useDebounce;
