import { INPUT_MANAGER } from "/src/main/manager-input.js"

import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { COORD_FACTORY } from "/src/grid/coord-factory.js"

export class ActionsManager {
    constructor (){}
    initialize(){
        this.mouse_global_coord = COORD_FACTORY.create_global(0,0);
        this.mouse_local_coord = COORD_FACTORY.create_local(0,0);
        this.mouse_hex_coord = COORD_FACTORY.create_hex(0,0);
    }
    update(){
        if (INPUT_MANAGER.topElement?.id !== "canvas-selected") return;
        this.mouse_local_coord = INPUT_MANAGER.get_mouse_local_coord();
        this.mouse_global_coord = this.mouse_local_coord.toGlobal();
        this.mouse_hex_coord = this.mouse_global_coord.toHex();

        if (INPUT_MANAGER.is_action_just_pressed("place-block") || INPUT_MANAGER.is_action_pressed("place-block")) {
            WORKER_MANAGER.postMessage( 
                "pkm_on_block",
                {"hex_coord_data": this.mouse_hex_coord} 
            )
        }
        if (INPUT_MANAGER.is_action_just_pressed("break-block") || INPUT_MANAGER.is_action_pressed("break-block")) {
            WORKER_MANAGER.postMessage( 
                "lkm_on_block",
                {"hex_coord_data": this.mouse_hex_coord} 
            )
        }

        if (INPUT_MANAGER.is_action_just_pressed("drag")) {
            // this.worldInteracting.push({
            //     type: "mkm_on_block",
            //     hex_coord: this.mouse_hex_coord,
            // })
        }
    }
    close(){
        this.mouse_global_coord = null;
        this.mouse_local_coord = null;
        this.mouse_hex_coord = null;
    }
}

export const ACTIONS_MANAGER = new ActionsManager();
