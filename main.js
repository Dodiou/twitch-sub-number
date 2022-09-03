const fs = require("fs");
const _ = require("lodash");
const tmi = require("tmi.js");
const yargs = require("yargs");
require("console-stamp")(console);

const argv = yargs
    .option("start", {
        alias: "s",
        description: "The number of subs to start the count at. If not provided, will attempt to read the previous number from the given --file.",
        type: "number"
    })
    .option("file", {
        alias: "f",
        description: "File to output sub number to. Default is './sub-number.txt'",
        type: "string",
        default: "./sub-number.txt"
    })
    .option("channel", {
        alias: "c",
        description: "The Twitch channel to watch messages for. Case-insensitive. Default is DumbDog.",
        type: "string",
        default: "DumbDog"
    })
    .help()
    .alias("help", "h")
    .argv


const writeFile = _.throttle(
    (filename, contents) => {
        try {
            console.log("Writing to file:", contents);
            fs.writeFileSync(filename, contents);
        }
        catch (err) {
            console.error(err);
        }
    },
    100,
    { leading: false, trailing: true }
);


let subNumber = argv.start || 0;
const fileExists = fs.existsSync(argv.file);
if (argv.start !== undefined || !fileExists) {
    console.log("Writing starting number to file.");
    writeFile(argv.file, "" + subNumber);
}
else if (argv.start === undefined && fileExists) {
    // read from file if no start value and file exists
    console.log("Reading starting number from file.");
    const numFromFile = fs.readFileSync(argv.file);
    subNumber = parseInt(numFromFile) || 0;
}

const addStateToNumber = async (state, user="UNKNOWN") => {
    let tierMultiplier = 1;
    let tierString = "tier 1";
    if (state) {
        switch(state["msg-param-sub-plan"]) {
            case "2000":
                tierMultiplier = 2;
                tierString = "tier 2";
                break;
            case "3000":
                tierMultiplier = 5;
                tierString = "tier 3";
                break;
            case "Prime":
                tierString = "prime";
                break;
        }
    }

    subNumber += tierMultiplier;
    console.log("New %s sub for %s.   Total: %d", tierString, user, subNumber);

    writeFile(argv.file, "" + subNumber);
};

const client = new tmi.Client({
    channels: [ argv.channel ]
});

client.connect().catch(console.error);

// Do not count the following events:
//   - anongiftpaidupgrade, giftpaidupgrade, primepaidupgrade;   these do not increase actual sub count immediately
//   - anonsubmysterygift, submysterygift;   these are the "gifted # subs" messages. these are followed by the # of individual anonsubgift/subgift events
const logGiftContinuation = (_channel, user) => console.log("Gift sub continuation for %s.   Not updating total.", user);
client.on("anongiftpaidupgrade", logGiftContinuation);
client.on("giftpaidupgrade", logGiftContinuation);
client.on("primepaidupgrade", logGiftContinuation);

const logMysteryGifts = (user, numOfSubs) => console.log("%s gifted %d subs. Total will be updated per each sub event.", user, numOfSubs);
client.on("anonsubmysterygift", (_channel, numOfSubs) => logMysteryGifts("Anon", numOfSubs));
client.on("submysterygift", (_channel, user, numOfSubs) => logMysteryGifts(user, numOfSubs));


// These sub events count.
client.on("resub", (_channel, user, _months, _message, state) => addStateToNumber(state, user));
client.on("sub", (_channel, user, _months, _message, state) => addStateToNumber(state, user));
client.on("subgift", (_channel, _gifter, _months, recip, _methods, state) => addStateToNumber(state, recip));
client.on("anonsubgift", (_channel, _months, recip, _methods, state) => addStateToNumber(state, recip));
// client.on("disconnected", () => {
//     TODO is reconnect needed?
// });

console.log('Connecting to channel "%s". Writing to file "%s". Starting number at "%d". Waiting for subs...', argv.channel, argv.file, subNumber);
