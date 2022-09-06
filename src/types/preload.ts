import { IpcRendererEvent } from "electron";
import { BaseLogger } from "./logger";

export interface SelectFileEvent {
  filepath: string;
  contents?: number;
}

// TODO any types?
export interface ElectronTSN {
  onSelectFile: (readFile?: boolean) => Promise<SelectFileEvent>;
  writeToFile: (contents: string) => Promise<any>,
  onConsoleLog: (callback: (event: IpcRendererEvent, method: keyof BaseLogger, ...args: any[]) => void) => void;
}
