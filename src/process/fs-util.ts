import fs from "fs";
import { BrowserWindow, dialog } from "electron";
import { throttle } from "lodash-es";

import { bufferThrottle } from "./mixins";
import { Logger } from "./main-logger";


const THROTTLE_TIME = 500;
const THROTTLE_OPTIONS = { leading: false, trailing: true };


export const selectFile = (browerWindow: BrowserWindow): Promise<string> => {
  return dialog.showOpenDialog(
    browerWindow, // TODO
    {
      properties: ["openFile", "promptToCreate", "dontAddToRecent"],
      filters: [{ name: "text", extensions: ["txt"] }],
    }
  )
    .then((results) => {
      if (results.canceled) {
        return "";
      }
      return results.filePaths[0];
    })
    .catch((err) => {
      Logger.error(err);
      return "";
    });
}

const _writeToFile = (filename: string, contents: string) => {
  try {
    Logger.log("Writing to file:", contents);
    fs.writeFileSync(filename, contents);
  }
  catch (err) {
    Logger.error(err);
  }
};

const _appendToFile = (filename: string, contents: string) => {
  try {
    Logger.log("Writing to file:", contents);
    fs.writeFileSync(filename, contents, { flag: "a+" });
  }
  catch (err) {
    Logger.error(err);
  }
};

export const logToFile = bufferThrottle(
  (contentsBuffer) => _appendToFile("log.txt", contentsBuffer.join("\n")),
  THROTTLE_TIME,
  THROTTLE_OPTIONS
)

export const writeToFile = throttle(
  _writeToFile,
  THROTTLE_TIME,
  THROTTLE_OPTIONS
);

export const readNumFromFile = (filename: string): number => {
  Logger.log("Reading number from file...");
  if (!fs.existsSync(filename)) {
    Logger.log("Could not read from file. File does not exist.");
    return 0;
  }

  try {
    const numFromFile = fs.readFileSync(filename).toString();
    // convert NaN to 0.
    return parseInt(numFromFile) || 0;
  }
  catch(err) {
    Logger.error(err);
    return 0;
  }
};
