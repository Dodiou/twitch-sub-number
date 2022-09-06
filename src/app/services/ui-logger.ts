import { ElectronTSN } from "../../types/preload";
import { BaseLogger } from "../../types/logger";

declare const electronTSN: ElectronTSN;

class UiLogger implements BaseLogger {
  constructor() {
    electronTSN.onConsoleLog((_event, method, ...args) => this[method](...args));
  }

  public log(...args: any[]): void {
    console.log(...args);
  }

  public error(...args: any[]): void {
    console.error(...args);
  }
}

export const Logger = new UiLogger();
