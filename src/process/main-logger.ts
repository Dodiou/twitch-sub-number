import { BrowserWindow } from "electron";
import { BaseLogger } from "../types/logger";

class MainLogger implements BaseLogger {
  private browserWindow?: BrowserWindow;

  public bridgeToRenderer(browserWindow: BrowserWindow): void {
    this.browserWindow = browserWindow;
  }

  public error(...args: any[]) {
    if (!this.browserWindow) {
      return;
    }

    this.browserWindow.webContents.send("console-log", "error", ...args);
  }

  public log(...args: any[]) {
    if (!this.browserWindow) {
      return;
    }

    this.browserWindow.webContents.send("console-log", "log", ...args);
  }
}

export const Logger = new MainLogger()
