import { INPUT_MANAGER } from "/src/main/manager-input.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

import { ACTIONS_MANAGER } from "/src/game/manager-actions.js"
import { DRAWER_MANAGER } from "/src/game/manager-drawer.js"
import { CAMERA_MANAGER } from "/src/game/manager-camera.js"
import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { HUD_MANAGER } from "/src/game/manager-hud.js"

class Game {
    constructor() {
        this.isActive = false;
    }
    
    async start(save_name){
        console.log('GAME :>> initialize');
        await WORKER_MANAGER.initialize(save_name);
        ACTIONS_MANAGER.initialize();
        CAMERA_MANAGER.initialize();
        DRAWER_MANAGER.initialize();
        HUD_MANAGER.initialize();

        INPUT_MANAGER.set_prevent_default(true);
        INPUT_MANAGER.update();
        UI_MANAGER.closeUi();
        this.isActive = true;
        this.draw();
    }

    async close(){
        this.isActive = false;
        ACTIONS_MANAGER.close();
        CAMERA_MANAGER.close();
        DRAWER_MANAGER.close();
        HUD_MANAGER.close();

        const preview_screenshot = DRAWER_MANAGER.canvas_game.toDataURL("image/png")
        await WORKER_MANAGER.postMessageAndWait(
            "save_and_quit",
            {"preview_screenshot": preview_screenshot},
            "save_and_quit_done"
        )
        INPUT_MANAGER.set_prevent_default(false);
        UI_MANAGER.openUi("menu_start");
    }

    update(){
        if (!this.isActive) return

        if (INPUT_MANAGER.is_window_resized()){
            DRAWER_MANAGER.resize_all_canvas();
            DRAWER_MANAGER.check_view_distance();
            HUD_MANAGER.on_resize();
        }

        ACTIONS_MANAGER.update();
        DRAWER_MANAGER.update();
        CAMERA_MANAGER.update();
        HUD_MANAGER.update();
    }

    draw = () => {
        if (!this.isActive) return;
        DRAWER_MANAGER.draw();
        HUD_MANAGER.draw();
        setTimeout(this.draw,0)
    }


}

export const GAME_MANAGER = new Game();