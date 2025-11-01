class Settings {
    constructor() {
        this["render-distance"] = 6;
        this["render-threshold"] = 2;
    }

    initialize() {
        console.log("%cSettings :>> initialize", "background-color: green; font-weight: bold");
    };

}

export const SETINGS_MANAGER = new Settings();