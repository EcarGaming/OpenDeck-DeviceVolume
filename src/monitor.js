const { spawn } = require("child_process");
const utils = require("./utils");
const events = require("./events");

let process = null;

function start() {

    if (process)
        return;

    utils.log("Starter pactl subscribe...");

    process = spawn("pactl", ["subscribe"]);

    process.stdout.on("data", async data => {

        const lines = data.toString().split("\n");

        for (const line of lines) {

            if (!line.trim())
                continue;

            utils.log("EVENT: " + line);

            if (!line.includes("skift"))
                continue;

            if (!line.includes("sink"))
                continue;

            utils.log("VOLUMEN ÆNDRET!");

            await events.refreshAllIcons();

        }

    });

    process.stderr.on("data", data => {

        utils.log("MONITOR FEJL: " + data.toString().trim());

    });

    process.on("close", code => {

        utils.log("Monitor stoppede: " + code);

        process = null;

    });

}

module.exports = {

    start

};