let websocket = null;

let uuid = "";
let actionInfo = {};
let context = "";
let currentSettings = {};

const deviceSelect = document.getElementById("device");
const modeSelect = document.getElementById("mode");

/*
 * OpenDeck kalder denne funktion når Property Inspector starter
 */

function connectElgatoStreamDeckSocket(
    inPort,
    inUUID,
    inRegisterEvent,
    inInfo,
    inActionInfo
) {

    uuid = inUUID;

    actionInfo = JSON.parse(inActionInfo);
    context = actionInfo.context;

    currentSettings = actionInfo.payload?.settings || {};
    loadSettings(currentSettings);

    websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);

    websocket.onopen = () => {

        websocket.send(JSON.stringify({

            event: inRegisterEvent,

            uuid: uuid

        }));

        requestDevices();

    };

    websocket.onmessage = (event) => {

        const message = JSON.parse(event.data);

        receive(message);

    };

}

/*
 * Modtag beskeder fra plugin
 */
function receive(message) {

    switch (message.event) {

        case "didReceiveSettings":

            console.log("didReceiveSettings:");
            console.log(message);

            loadSettings(message.payload.settings);

            break;

        case "sendToPropertyInspector":

            handlePluginMessage(message.payload);

            break;

    }

}

/*
 * Modtag data fra plugin
 */
function handlePluginMessage(payload) {

    switch (payload.request) {

        case "devices":

            fillDevices(payload.devices);

            break;

    }

}

/*
 * Udfyld dropdown med output devices
 */
function fillDevices(devices) {

    deviceSelect.innerHTML = "";

    for (const device of devices) {

        const option = document.createElement("option");

        option.value = device.id;

        option.textContent = device.name;

        deviceSelect.appendChild(option);

    }

    if (currentSettings.device)
        deviceSelect.value = currentSettings.device;

    if (currentSettings.mode)
        modeSelect.value = currentSettings.mode;

}

/*
 * Indlæs gemte settings
 */
function loadSettings(settings) {

    if (!settings)
        return;

    currentSettings = settings;

    if (settings.device)
        deviceSelect.value = settings.device;

    if (settings.mode)
        modeSelect.value = settings.mode;

}

/*
 * Gem settings
 */
function saveSettings() {

    websocket.send(JSON.stringify({

        event: "setSettings",

        context: context,

        payload: {

            device: deviceSelect.value,

            mode: modeSelect.value

        }

    }));

}

/*
 * Bed plugin om listen over devices
 */
function requestDevices() {

    websocket.send(JSON.stringify({

        action: actionInfo.action,

        context: context,

        event: "sendToPlugin",

        payload: {

            request: "getDevices"

        }

    }));

}

/*
 * Events
 */
deviceSelect.addEventListener("change", saveSettings);

modeSelect.addEventListener("change", saveSettings);