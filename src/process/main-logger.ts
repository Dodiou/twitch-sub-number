import { BrowserWindow } from "electron";
import { BaseLogger } from "../types/logger";

class MainLogger implements BaseLogger {
  private browserWindow?: BrowserWindow;

  public setBrowserWindow(browserWindow: BrowserWindow | undefined): void {
    this.browserWindow = browserWindow;
  }

  public error(...args: any[]) {
    if (!this.browserWindow) {
      console.log("No window connected to logging. Logging to console.");
      console.error(...args);
      return;
    }

    this.browserWindow.webContents.send("console-log", "error", ...args);
  }

  public log(...args: any[]) {
    if (!this.browserWindow) {
      console.log("No window connected to logging. Logging to console.");
      console.log(...args);
      return;
    }

    this.browserWindow.webContents.send("console-log", "log", ...args);
  }
}

export const Logger = new MainLogger()
