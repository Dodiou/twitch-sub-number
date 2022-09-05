// TODO any types?
export interface ElectronTSN {
  onSelectFile: () => Promise<string>;
  writeToFile: (contents: string) => Promise<any>,
  logToFile: (contents: string) => Promise<any>,
}
