// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { ElectronTSN } from "./types/preload";

const electronTSN: ElectronTSN = {
  writeToFile: (contents: string) => ipcRenderer.invoke("writeToFile", contents),
  onSelectFile: (readFile?: boolean) => ipcRenderer.invoke("onSelectFile", readFile),
  logToFile: (contents: string) => ipcRenderer.invoke("logToFile", contents),
};

contextBridge.exposeInMainWorld('electronTSN', electronTSN);

