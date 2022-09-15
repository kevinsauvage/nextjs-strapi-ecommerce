const debounce = (callback, wait, immediate) => {
  let timeout;
  return (...args) => {
    const callNow = immediate && !timeout;
    const next = () => callback(...args);
    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
    if (callNow) {
      next();
    }
  };
};

export default debounce;
