const debounce = (func: Function, wait: number) => {
  let timeout: number | null = null;

  return function executedFunction(...args: any[]) {
    return new Promise((resolve) => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        resolve(func(...args));
      }, wait);
    });
  };
};

export {debounce};