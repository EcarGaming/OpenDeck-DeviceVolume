/*
 * Standardindstillinger
 */
function defaults() {

    return {
        device: "",
        mode: "up"
    };

}

/*
 * Flet gemte settings med standardindstillinger.
 * Sikrer at nye felter automatisk får en værdi.
 */
function merge(settings = {}) {

    return {
        ...defaults(),
        ...settings
    };

}

/*
 * Valider settings.
 * Ret ugyldige værdier til standard.
 */
function validate(settings = {}) {

    const result = merge(settings);

    if (result.mode !== "up" && result.mode !== "down") {
        result.mode = "up";
    }

    if (typeof result.device !== "string") {
        result.device = "";
    }

    return result;

}

/*
 * Er der valgt en output-enhed?
 */
function hasDevice(settings = {}) {

    return (
        typeof settings.device === "string" &&
        settings.device.trim().length > 0
    );

}

module.exports = {

    defaults,
    merge,
    validate,
    hasDevice

};