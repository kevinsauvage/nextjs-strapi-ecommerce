const debounce = (func, delay) => {
  let timerId;
  return () => {
    if (!timerId) {
      func();
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
};
export default debounce;
