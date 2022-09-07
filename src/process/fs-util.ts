import fs from "fs";
import { BrowserWindow, dialog } from "electron";
import { throttle } from "lodash-es";

import { Logger } from "./main-logger";


const THROTTLE_TIME = 500;
const THROTTLE_OPTIONS = { leading: false, trailing: true };


const _writeToFile = (filename: string, contents: string) => {
  try {
    Logger.log("Writing to file:", contents);
    fs.writeFileSync(filename, contents);
  }
  catch (err) {
    Logger.error(err);
  }
};

export const selectFile = (browerWindow: BrowserWindow): Promise<string> => {
  return dialog.showOpenDialog(
    browerWindow,
    {
      properties: ["openFile", "promptToCreate", "dontAddToRecent"],
      filters: [{ name: "text", extensions: ["txt"] }],
    }
  )
    .then((results) => {
      if (results.canceled) {
        return "";
      }
      const filepath = results.filePaths[0];

      if (!filepath.endsWith(".txt")) {
        dialog.showErrorBox("Error selecting file", 'Please create or select a file ending in ".txt".');
        return "";
      }

      if (!fs.existsSync(filepath)) {
        Logger.log("File does not exist. Creating file starting at 0.");
        _writeToFile(filepath, "0");
      }

      return filepath;
    })
    .catch((err) => {
      Logger.error(err);
      return "";
    });
}

export const writeToFile = throttle(
  _writeToFile,
  THROTTLE_TIME,
  THROTTLE_OPTIONS
);

export const readNumFromFile = (filename: string): number => {
  Logger.log("Reading number from file...");

  try {
    if (!fs.existsSync(filename)) {
      Logger.log("Could not read from file. File does not exist. Creating file starting at 0.");
      _writeToFile(filename, "0");
      return 0;
    }

    const numFromFile = fs.readFileSync(filename).toString();
    // convert NaN to 0.
    return parseInt(numFromFile) || 0;
  }
  catch(err) {
    Logger.error(err);
    return 0;
  }
};
