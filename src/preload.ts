// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { ElectronTSN } from "./types/preload";

const electronTSN: ElectronTSN = {
  writeToFile: (contents: string) => ipcRenderer.invoke("write-to-file", contents),
  onSelectFile: (readFile?: boolean) => ipcRenderer.invoke("select-file", readFile),
  onConsoleLog: (callback) => {
    ipcRenderer.on("console-log", callback)
  },
};

contextBridge.exposeInMainWorld('electronTSN', electronTSN);

