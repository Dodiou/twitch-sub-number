
export interface BaseLogger {
  error(...args: any[]): void;
  log(...args: any[]): void;
  warn(...args: any[]): void;
}
