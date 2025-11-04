import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { SETINGS_MANAGER } from "/src/main/manager-setings.js"
import { INPUT_MANAGER } from "/src/main/manager-input.js"
import { ID_MANAGER } from "/src/main/manager-id.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

import { GAME_MANAGER } from "/src/game/manager-game.js"

import { SaveDataBase } from "/src/worker/manager-saveDB.js"

class Application {
    constructor (){
        this.tick = null;
    }
    async initialize(){
        console.log("%cApplication :>> initialize", "background-color: green; font-weight: bold");
        await RESOURCES_MANAGER.initialize(
            {
                "html": true,
                "image": true,
                "block": true,
                "inventorys": true,
                "control_setings": true,
                "item": true,
            }
        );
        await UI_MANAGER.initialize();
        SETINGS_MANAGER.initialize();
        INPUT_MANAGER.initialize();
        ID_MANAGER.initialize();

        // DEBUG //
        await UI_MANAGER.UI_obj.onClick["qick_start_button"]();
        // DEBUG //

        this.tick = setInterval(this.doMainTick, 10)
    }

    doMainTick = () => {
        GAME_MANAGER.update();
        UI_MANAGER.update();
        INPUT_MANAGER.update();
    }

    async createNewWorld (user_world_name) {
        const existing_dev_worlds_names = (await indexedDB.databases())
            .filter(db => db.name?.startsWith("save:"))
            .map(db => db.name.slice(5));
        let dev_world_name = user_world_name.replace(/\s+/g, "_");
        while (existing_dev_worlds_names.includes(dev_world_name)) {
            dev_world_name += "-";
        }
        const DB = new SaveDataBase("save:" + dev_world_name);
        DB.setItem("info", "creation-date", new Date());
        DB.setItem("info", "last-played-date", new Date());
        DB.setItem("info", "user-world-name", user_world_name);
        return dev_world_name;
    };

    async deleteWorld(world_name_dev){
        indexedDB.deleteDatabase(world_name_dev);
    }
    
    async deleteAllWorlds(){
        (await indexedDB.databases())
            .filter(obj => obj.name.startsWith("save:"))
            .map(obj => indexedDB.deleteDatabase(obj.name));
    }
}

export const APPLICATION_MANAGER = new Application();