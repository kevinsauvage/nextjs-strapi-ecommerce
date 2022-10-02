const debounce = (func, delay) => {
  let timerId;
  console.log(timerId, 'timerId', timerId, 'debounce');
  return () => {
    if (!timerId) {
      console.log('no timer, call function');
      func();
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
};
export default debounce;
