const { exec } = require("child_process");

/*
 * Kør en shell-kommando
 */
function run(command) {

    return new Promise((resolve, reject) => {

        exec(command, (error, stdout) => {

            if (error) {
                reject(error);
                return;
            }

            resolve(stdout);

        });

    });

}

/*
 * Hent alle output devices
 */
async function getOutputDevices() {

    const output = await run("wpctl status");

    return parseDevices(output);

}

/*
 * Find aktuelt PipeWire-ID ud fra navn eller ID
 */
async function resolveDevice(device) {

    // Hvis der allerede er et numerisk ID
    if (/^\d+$/.test(device))
        return device;

    const devices = await getOutputDevices();

    const match = devices.find(d => d.name === device);

    if (!match)
        throw new Error(`Output device "${device}" blev ikke fundet`);

    return match.id;

}

/*
 * Find output devices i wpctl status
 */
function parseDevices(text) {

    const devices = [];

    const lines = text.split("\n");

    let inAudio = false;
    let inSinks = false;

    for (const line of lines) {

        if (line.trim().startsWith("Audio")) {            
            inAudio = true;
            continue;
        }

        if (!inAudio) {
            continue;
        }

        if (line.includes("Sinks:")) {
            inSinks = true;
            continue;
        }

        if (inSinks && line.includes("Sources:")) {
            break;
        }

        if (!inSinks) {
            continue;
        }

        const match = line.match(/\b(\d+)\.\s+(.+)/);

        if (!match) {
            continue;
        }

        devices.push({
            id: match[1],
            name: match[2].replace(/\s+\[vol:.*?\]$/, "").trim()
        });
    }

    return devices;

}

/*
 * Hent volumen på et device
 */
async function getVolume(device) {

    const id = await resolveDevice(device);

    const output = await run(`wpctl get-volume ${id}`);

    return parseVolume(output);

}

/*
 * Konverter wpctl get-volume til procent
 */
function parseVolume(text) {

    const match = text.match(/([0-9.]+)/);

    if (!match)
        return 0;

    let volume = Math.round(parseFloat(match[1]) * 100);

    return Math.max(0, Math.min(100, volume));

}

/*
 * Ændr volumen
 */
async function setVolume(device, amount) {

    const id = await resolveDevice(device);

    let current = await getVolume(id);

    let target = current + amount;

    if (target < 0)
        target = 0;

    if (target > 100)
        target = 100;

    await run(`wpctl set-volume ${id} ${target}%`);

}

/*
 * Mute
 */
async function setMute(device, mute = true) {

    const id = await resolveDevice(device);

    await run(`wpctl set-mute ${id} ${mute ? 1 : 0}`);

}

/*
 * Hent standard output device
 */

async function getDefaultOutputDevice() {

    const output = await run("wpctl status");

    const lines = output.split("\n");

    let inAudio = false;
    let inSinks = false;

    for (const line of lines) {

        if (line.trim().startsWith("Audio")) {
            inAudio = true;
            continue;
        }

        if (!inAudio)
            continue;

        if (line.includes("Sinks:")) {
            inSinks = true;
            continue;
        }

        if (inSinks && line.includes("Sources:"))
            break;

        if (!inSinks)
            continue;

        const match = line.match(/^\s*[│├└ ]*\*\s*(\d+)\.\s+(.+)$/);

        if (match)
            return match[2].replace(/\s+\[vol:.*?\]$/, "").trim();

    }

    throw new Error("Ingen standard output fundet");

}

module.exports = {

    run,

    getOutputDevices,

    getDefaultOutputDevice,

    getVolume,

    setVolume,

    setMute

};