import { throttle } from "lodash-es";

export const THROTTLE_TIME = 100;
export const THROTTLE_OPTIONS = { leading: false, trailing: true };

export type HandlerFunc<T> = (this: undefined, subNumber: T) => void;

export abstract class SingleListenerEventEmitter<T> {
  protected listener?: (newValue: T) => void;
  private lastEmittedValue?: T;

  public onChange(handler?: HandlerFunc<T>): void {
    this.listener = handler;
    if (this.listener && this.lastEmittedValue) {
      this.listener(this.lastEmittedValue);
    }
  }

  protected emitChange = throttle(
    (value: T): void => {
      this.lastEmittedValue = value;
      this.listener?.(value)
    },
    THROTTLE_TIME,
    THROTTLE_OPTIONS
  );
}


