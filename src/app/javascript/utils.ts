let timeout: any;
export const debounce = (func: Function, wait: number) => {
  return function (...args: any) {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
