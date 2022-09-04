// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('funcs', {
    writeToFile: (contents: string) => ipcRenderer.invoke("writeToFile", contents),
    setFilepath: (filepath: string) => ipcRenderer.invoke("setFilepath", filepath),
    logToFile: (contents: string) => ipcRenderer.invoke("logToFile", contents),
});

