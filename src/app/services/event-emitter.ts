import { throttle } from "lodash-es";

export const THROTTLE_TIME = 100;
export const THROTTLE_OPTIONS = { leading: false, trailing: true };

export type HandlerFunc<T> = (this: undefined, subNumber: T) => void;

export class SingleListenerEventEmitter<T> {
  private listener?: (newValue: T) => void;

  public onChange(handler?: HandlerFunc<T>): void {
    this.listener = handler;
  }

  protected emitChange = throttle(
    (value: T): void => this.listener?.(value),
    THROTTLE_TIME,
    THROTTLE_OPTIONS
  );
}


