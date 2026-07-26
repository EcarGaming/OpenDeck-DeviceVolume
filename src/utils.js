const fs = require("fs");

const LOGFILE = "/tmp/devicevolume.log";

/**
 * Begrænser en værdi mellem min og max.
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Afrunder til nærmeste heltal.
 */
function round(value) {
    return Math.round(value);
}

/**
 * Konverterer en volumen (0.0 - 1.0) til procent.
 */
function toPercent(value) {
    return round(clamp(value * 100, 0, 100));
}

/**
 * Skriver en besked til logfil.
 */
function log(message) {
    const time = new Date().toLocaleTimeString();
    const line = `[${time}] ${message}\n`;

    try {
        fs.appendFileSync(LOGFILE, line);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    clamp,
    round,
    toPercent,
    log
};