#!/usr/bin/env node
const WebSocket = require("ws");

const pipewire = require("./pipewire");
const icons = require("./icons");
const settings = require("./settings");
const utils = require("./utils");
const monitor = require("./monitor");
const events = require("./events");

let websocket = null;
let pluginUUID = "";
let registerEvent = "";
let port = 0;

const actions = new Map();

/*
 * Program start
 */
function main() {

    parseArguments();

    utils.log("Device Volume Plugin starter...");

    connect();
}

/*
 * Læs argumenter fra OpenDeck
 */
function parseArguments() {

    const args = process.argv;
    
    console.log("process.argv:");
    console.log(process.argv);

    for (let i = 0; i < args.length; i++) {

        switch (args[i]) {

            case "-port":
                port = parseInt(args[++i]);
                break;

            case "-pluginUUID":
                pluginUUID = args[++i];
                break;

            case "-registerEvent":
                registerEvent = args[++i];
                break;
        }
    }

    utils.log("Port: " + port);
    utils.log("Plugin UUID: " + pluginUUID);
}

/*
 * Opret websocket
 */
function connect() {

    websocket = new WebSocket(`ws://127.0.0.1:${port}`);

    websocket.on("open", onOpen);

    websocket.on("close", onClose);

    websocket.on("error", onError);

    websocket.on("message", onMessage);
}

/*
 * Websocket connected
 */
function onOpen() {

    utils.log("Forbundet til OpenDeck");

    registerPlugin();

    events.setRefreshCallback(refreshAllIcons);

    monitor.start();

    setTimeout(() => {

        refreshAllIcons();

    }, 1000);

}

/*
 * Registrer plugin
 */
function registerPlugin() {

    websocket.send(JSON.stringify({

        event: registerEvent,

        uuid: pluginUUID

    }));

    utils.log("Plugin registreret");
}

/*
 * Modtag beskeder
 */
function onMessage(message) {

    let data;

    try {

        data = JSON.parse(message);

    } catch {

        return;
    }

    switch (data.event) {

        case "willAppear":
            handleWillAppear(data);
            break;

        case "willDisappear":
            handleWillDisappear(data);
            break;

        case "keyDown":
            handleKeyDown(data);
            break;

        case "didReceiveSettings":
            handleReceiveSettings(data);
            break;

        case "sendToPlugin":
            handleSendToPlugin(data);
            break;

        default:
            utils.log("Ukendt event: " + data.event);
    }
}

/*
 * Knappen bliver synlig
 */
async function handleWillAppear(data) {

    utils.log("willAppear");

    actions.set(data.context, {

        context: data.context,

        settings: data.payload.settings || {}

    });

    const action = actions.get(data.context);

    // Hvis knappen er helt ny, opret standard-settings
    if (!action.settings.device) {

        action.settings = {
            device: await pipewire.getDefaultOutputDevice(),
            mode: "up"
        };

        websocket.send(JSON.stringify({

            event: "setSettings",

            context: data.context,

            payload: action.settings

        }));

    }

    try {

        const volume = await pipewire.getVolume(action.settings.device);

        utils.log("Volume ved startup: " + volume);

        setImage(
            data.context,
            icons.get(action.settings.mode, volume)
        );

    } catch (err) {

        utils.log(err.stack || err.toString());

    }

}

/*
 * Knappen fjernes
 */

function handleWillDisappear(data) {

    utils.log("willDisappear");

    actions.delete(data.context);
}

/*
 * Brugeren trykker
 */
async function handleKeyDown(data) {

    utils.log("keyDown");

    const action = actions.get(data.context);

    if (!action)
        return;

    const settings = action.settings;

    if (!settings.device)
        return;

    try {

        if (settings.mode === "down") {

            await pipewire.setVolume(settings.device, -10);

        } else {

            await pipewire.setVolume(settings.device, 10);

        }

        const volume = await pipewire.getVolume(settings.device);

        setImage(
            data.context,
            icons.get(settings.mode, volume)
        );

    } catch (err) {

        utils.log(err.stack || err.toString());

    }

}

/*
 * Settings opdateret
 */
async function handleReceiveSettings(data) {

    utils.log("didReceiveSettings");

    const action = actions.get(data.context);

    if (!action)
        return;

    action.settings = data.payload.settings || {};

    utils.log(JSON.stringify(action.settings));

    if (!action.settings.device)
        return;

    try {

        const volume = await pipewire.getVolume(action.settings.device);

        setImage(
            data.context,
            icons.get(action.settings.mode, volume)
        );

    } catch (err) {

        utils.log(err.stack || err.toString());

    }

}

/*
 * Property Inspector sender data
 */
async function handleSendToPlugin(data) {

    utils.log("sendToPlugin");

    utils.log(JSON.stringify(data, null, 2));

    if (!data.payload) {
        utils.log("Ingen payload");
        return;
    }

    utils.log("Request: " + data.payload.request);

    if (data.payload.request !== "getDevices") {
        utils.log("Ukendt request");
        return;
    }

    try {

        const devices = await pipewire.getOutputDevices();

        utils.log("Antal devices: " + devices.length);

        websocket.send(JSON.stringify({

            event: "sendToPropertyInspector",
            action: data.action,
            context: data.context,

            payload: {
                request: "devices",
                devices: devices
            }

        }));

        utils.log("Liste sendt");

    } catch (err) {

        utils.log(err.stack || err.toString());

    }

}

/*
 * Websocket lukket
 */
function onClose() {

    utils.log("OpenDeck lukket");

}

/*
 * Fejl
 */
function onError(error) {

    console.error(error);

}

/*
 * Opdater alle ikoners aktuelle volumen
 */
async function refreshAllIcons() {

    for (const [context, action] of actions) {

        if (!action.settings?.device)
            continue;

        try {

            const volume = await pipewire.getVolume(action.settings.device);
            
            utils.log(`Opdaterer ${context} (${action.settings.device})`);


            setImage(
                context,
                icons.get(action.settings.mode, volume)
            );

        } catch (err) {

            utils.log(err.stack || err.toString());

        }

    }

}

/*
 * Send nyt ikon
 */
function setImage(context, image) {

    utils.log("Sætter ikon:");
    utils.log(image);

    websocket.send(JSON.stringify({

        event: "setImage",

        context: context,

        payload: {

            image: image

        }

    }));
}

/*
 * Start plugin
 */

main();


module.exports = {

    refreshAllIcons

};