import fs from "fs";
import { BrowserWindow, dialog } from "electron";

import { throttle } from "lodash-es";
import { bufferThrottle } from "./mixins";


const THROTTLE_TIME = 100;
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
      console.error(err);
      return "";
    });
}

const _writeToFile = (filename: string, contents: string) => {
  try {
    console.log("Writing to file:", contents);
    fs.writeFileSync(filename, contents);
  }
  catch (err) {
    console.error(err);
  }
};

const _appendToFile = (filename: string, contents: string) => {
  try {
    console.log("Writing to file:", contents);
    fs.writeFileSync(filename, contents, { flag: "a+" });
  }
  catch (err) {
    console.error(err);
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

export const readNumFromFile = (filename: string) => {
  const numFromFile = fs.readFileSync(filename).toString();
  return parseInt(numFromFile) || 0;
};
