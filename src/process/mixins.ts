import { debounce, DebouncedFunc, DebounceSettings, throttle, ThrottleSettings } from "lodash-es";

// TODO fix <any> casts?

export const bufferDebounce: typeof debounce = <T extends (...args: any[]) => any>(func: T, wait?: number, options?: DebounceSettings) => {
  let argsBuffer: T[] = [];
  const debouncedFunc = debounce(
    () => {
      func.call(undefined, argsBuffer);
      argsBuffer = [];
    },
    wait,
    options
  );

  const bufferedFunc: DebouncedFunc<T> = <DebouncedFunc<T>><any>Object.assign(
    (...args: Parameters<T>) => {
      argsBuffer.push(...args);
      debouncedFunc();
    },
    {
      cancel: (): void => {
        debouncedFunc.cancel();
        argsBuffer = [];
      },
      flush: debouncedFunc.flush,
    }
  );
  return bufferedFunc;
};

export const bufferThrottle: typeof throttle = <T extends (...args: any[]) => any>(func: T, wait?: number, options?: ThrottleSettings) => {
  let argsBuffer: T[] = [];
  const throttledFunc = throttle(
    () => {
      func.call(undefined, argsBuffer);
      argsBuffer = [];
    },
    wait,
    options
  );

  const bufferedFunc: DebouncedFunc<T> = <DebouncedFunc<T>><any>Object.assign(
    (...args: Parameters<T>) => {
      argsBuffer.push(...args);
      throttledFunc();
    },
    {
      cancel: (): void => {
        throttledFunc.cancel();
        argsBuffer = [];
      },
      flush: throttledFunc.flush,
    }
  );
  return bufferedFunc;
};

