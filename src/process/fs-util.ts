import fs from "fs";
import { throttle } from "lodash-es";
import { bufferThrottle } from "./mixins";


const THROTTLE_TIME = 100;
const THROTTLE_OPTIONS = { leading: false, trailing: true };


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

const logToFile = bufferThrottle(
    (contentsBuffer) => _appendToFile("log.txt", contentsBuffer.join("\n")),
    THROTTLE_TIME,
    THROTTLE_OPTIONS
)

const writeToFile = throttle(
    _writeToFile,
    THROTTLE_TIME,
    THROTTLE_OPTIONS
);

const readNumFromFile = (filename: string) => {
    const numFromFile = fs.readFileSync(filename).toString();
    return parseInt(numFromFile) || 0;
};

module.exports = {
    readNumFromFile,
    writeToFile,
    logToFile,
}
