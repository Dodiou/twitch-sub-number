const fs = require("fs");
const _ = require("lodash");
const tmi = require("tmi.js");
const { readNumFromFile, writeToFile } = require("./fs-util");


// -----------------------------------------
// IGNORE THIS FILE FOR NOW. Rewriting.
// -----------------------------------------

let subNumber = argv.start || 0;
const fileExists = fs.existsSync(argv.file);
if (argv.start !== undefined || !fileExists) {
    console.log("Writing starting number to file.");
    writeToFile(argv.file, "" + subNumber);
}
else if (argv.start === undefined && fileExists) {
    // read from file if no start value and file exists
    console.log("Reading starting number from file.");
    const numFromFile = readNumFromFile(argv.file);
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

    writeToFile(argv.file, "" + subNumber);
};

const client = new tmi.Client({
    channels: [ argv.channel ],
    connection: {
        reconnect: true
    }
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

console.log('Connecting to channel "%s". Writing to file "%s". Starting number at "%d". Waiting for subs...', argv.channel, argv.file, subNumber);
