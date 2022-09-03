# twitch-sub-number
Sub number to file for Twitch

# How to use:
Install [Node.js](https://nodejs.org/en/), v.16.15.0 and up should work.
This will also install "npm".

Once installed, open up a terminal (open the folder in windows explorer,
and just type "cmd" in the file path bar and hit enter).

Use `npm install` to install project dependencies (only needs to be run
once).

Use `"node .\main.js -s <starting-number>"` to run the program. By default,
the program will connect to the channel `"DumbDog"` and will write the sub number to `"./sub-number.txt"`.

## Options

Use `--start <number>` or `-s <number>` to start the number at a given
number. If omitted, the starting number will be read from the given
`--file` if it exists.

Use `--file <name>` to specify an output file. By default, the file
will be `./sub-number.txt.`.

Use `--channel <name>` or `-c` to specify a Twitch channel. This is
case-insensitive. Default is `DumbDog`.
