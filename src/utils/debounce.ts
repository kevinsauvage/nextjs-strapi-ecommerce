export default function debounce<T extends (...arguments_: unknown[]) => void>(
  function_: T,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...arguments_: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      function_.apply(this, arguments_);
    }, delay);
  };
}
