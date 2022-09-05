export interface SelectFileEvent {
  filepath: string;
  contents?: number;
}

// TODO any types?
export interface ElectronTSN {
  onSelectFile: (readFile?: boolean) => Promise<SelectFileEvent>;
  writeToFile: (contents: string) => Promise<any>,
  logToFile: (contents: string) => Promise<any>,
}
