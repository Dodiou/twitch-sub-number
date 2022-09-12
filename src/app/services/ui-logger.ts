import { ElectronTSN } from "../../types/preload";
import { BaseLogger } from "../../types/logger";
import { SingleListenerEventEmitter } from "./event-emitter";

declare const electronTSN: ElectronTSN;

const MAX_LOG_SIZE = 200;

export enum LogType {
  Error = "error",
  Info = "info",
  Warn = "warn"
}

export interface Log {
  id: number;
  message: string;
  timestamp: string;
  type: LogType;
}

class UiLogger extends SingleListenerEventEmitter<Log[]> implements BaseLogger {
  private logQueue: Log[] = [];
  private nextLogId = 0;

  constructor() {
    super();
    electronTSN.onConsoleLog((_event, method, log, ...args) => this[method](log, ...args));
  }

  public log(...args: any[]): void {
    const [ message, ...consoleArgs ] = args;
    if (typeof message !== "string") {
      console.log(...args);
      return;
    }

    this.addLog(LogType.Info, message);
    console.log(message, ...consoleArgs);
  }

  public error(...args: any[]): void {
    let [ message, ...consoleArgs ] = args;
    if (typeof message !== "string") {
      consoleArgs = args;
      message = "An unknown error occured. View the developer console for more info."
    }

    this.addLog(LogType.Error, message);
    console.error(message, ...consoleArgs);
  }
  
  public warn(...args: any[]): void {
    const [ message, ...consoleArgs ] = args;
    if (typeof message !== "string") {
      console.warn(...args);
      return;
    }

    this.addLog(LogType.Warn, message);
    console.warn(message, ...consoleArgs);
  }

  private addLog(type: LogType, message: string): void {
    const log: Log = {
      id: this.nextLogId++,
      message,
      timestamp: new Date().toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3,
        } as any // for some reason, fractionalSecondDigits is not on the type
      ), // can also use toLocaleString if date is needed.
      type,
    };

    if (this.logQueue.length >= MAX_LOG_SIZE) {
      this.logQueue.shift();
    }
    this.logQueue.push(log);
    this.emitChange(this.logQueue);
  }
}

export const Logger = new UiLogger();
