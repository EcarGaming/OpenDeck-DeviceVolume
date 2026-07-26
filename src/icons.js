function get(mode, volume) {

    volume = Math.max(0, Math.min(100, Math.round(volume)));

    let file;

    if (mode === "down") {

        if (volume === 0)
            file = "down_0.png";
        else if (volume <= 9)
            file = "down_1-9.png";
        else if (volume <= 18)
            file = "down_10-18.png";
        else if (volume <= 27)
            file = "down_19-27.png";
        else if (volume <= 36)
            file = "down_28-36.png";
        else if (volume <= 45)
            file = "down_37-45.png";
        else if (volume <= 54)
            file = "down_46-54.png";
        else
            file = "down_55-100.png";

    } else {

        if (volume <= 45)
            file = "up_00-45.png";
        else if (volume <= 54)
            file = "up_46-54.png";
        else if (volume <= 63)
            file = "up_55-63.png";
        else if (volume <= 72)
            file = "up_64-72.png";
        else if (volume <= 81)
            file = "up_73-81.png";
        else if (volume <= 90)
            file = "up_82-90.png";
        else if (volume <= 99)
            file = "up_91-99.png";
        else
            file = "up_100.png";

    }

    return "icons/" + file.replace(".png", "");

}

module.exports = {
    get
};