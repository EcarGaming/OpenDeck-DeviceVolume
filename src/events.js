let refreshCallback = null;

function setRefreshCallback(callback) {

    refreshCallback = callback;

}

async function refreshAllIcons() {

    if (refreshCallback)
        await refreshCallback();

}

module.exports = {

    setRefreshCallback,
    refreshAllIcons

};