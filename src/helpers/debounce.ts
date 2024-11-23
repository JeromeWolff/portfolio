export const debounce = <A extends unknown[]>(callback: (...args: A) => unknown, delay: number) => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      callback(...args);
    }, delay);
  };
};
