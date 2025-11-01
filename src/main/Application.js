import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { SETINGS_MANAGER } from "/src/main/manager-setings.js"
import { DRAWER_MANAGER } from "/src/game/manager-drawer.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { INPUT_MANAGER } from "/src/main/manager-input.js"
import { ID_MANAGER } from "/src/main/manager-id.js"

import { SaveDataBase } from "/src/worker/manager-saveDB.js"
import { Game } from "/src/game/game.js"

class Application {
    constructor (){
        this.game = null;
        this.appTick = null;
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
        // await UI_MANAGER.activeMenuObject.onClick["qick_start_button"]();
        // DEBUG //

        this.appTick = setInterval(this.doMainTick, 10)
    }
    async startGame(save_name){
        this.game = new Game();
        await this.game.start(save_name);

        this.doMainDraw();

        INPUT_MANAGER.set_prevent_default(true);
        INPUT_MANAGER.update();

        UI_MANAGER.closeUi();
    }
    async saveAndQuit(){
        const preview_screenshot = DRAWER_MANAGER.canvas_game.toDataURL("image/png")
        await WORKER_MANAGER.postMessageAndWait(
            "save_and_quit",
            {"preview_screenshot": preview_screenshot},
            "save_and_quit_done"
        )
        document.getElementById("app").replaceChildren();
        
        this.game = null;
        INPUT_MANAGER.set_prevent_default(false);
        await UI_MANAGER.initialize();
        UI_MANAGER.openUi("menu_start");
    }

    doMainTick = () => {
        if (this.game) this.game.update();
        if (UI_MANAGER.isActive) UI_MANAGER.update();
    
        INPUT_MANAGER.update();
    }
    doMainDraw = () => {
        if (!this.game) return;
        this.game.draw();
        setTimeout(this.doMainDraw,0)
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