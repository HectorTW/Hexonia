import { INPUT_MANAGER } from "/src/main/manager-input.js"

import { ACTIONS_MANAGER } from "/src/game/manager-actions.js"
import { DRAWER_MANAGER } from "/src/game/manager-drawer.js"
import { CAMERA_MANAGER } from "/src/game/manager-camera.js"
import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { HUD_MANAGER } from "/src/game/manager-hud.js"

export class Game {
    constructor() {
        this.isActive = false;
    }
    async start(save_name){
        console.log('GAME :>> start');
        await WORKER_MANAGER.initialize(save_name);
        ACTIONS_MANAGER.initialize();
        CAMERA_MANAGER.initialize();
        DRAWER_MANAGER.initialize();
        HUD_MANAGER.initialize();
        
        this.isActive = true;
    }
    update(){
        if (INPUT_MANAGER.is_window_resized()){
            DRAWER_MANAGER.resizeAllCanvases();
            DRAWER_MANAGER.checkViewDistance();
            HUD_MANAGER.resizeWindowSize();
        }
        
        if (!this.isActive) return
        CAMERA_MANAGER.update();
        ACTIONS_MANAGER.update();
        HUD_MANAGER.update();

    }
    draw(){
        DRAWER_MANAGER.draw();
        HUD_MANAGER.draw();
    }
}