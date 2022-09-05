// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { ElectronTSN } from "./types/preload";

contextBridge.exposeInMainWorld('electronTSN', {
  writeToFile: (contents: string) => ipcRenderer.invoke("writeToFile", contents),
  onSelectFile: () => ipcRenderer.invoke("onSelectFile"),
  logToFile: (contents: string) => ipcRenderer.invoke("logToFile", contents),
} as ElectronTSN);

