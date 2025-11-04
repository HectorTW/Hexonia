import { INPUT_MANAGER } from "/src/main/manager-input.js";

import { DRAWER_MANAGER } from "/src/game/manager-drawer.js";
import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { COORD_FACTORY } from "/src/grid/coord-factory.js"

class CameraManager {
    constructor() {
        this.max_scale = 300;
        this.min_scale = 5;
        this.speed_factor = 8;
        this.zoom_factor = 1.10;

        this.scale = null;
        this.speed = null;
        
        this.center_global_coord = null;
        this.center_chunk_coord = null;
        this.center_hex_coord = null;
        this.global_coord = null;
    }
    
    initialize(){
        this.scale = 60;
        this.speed = this.speed_factor / this.scale;

        this.center_global_coord = null;
        this.center_chunk_coord = null;
        this.center_hex_coord = null;
        this.global_coord = null;
        
        this.global_coord = COORD_FACTORY.create_global(0,0);
        this.check_center_chunk_coord();
    }
    close(){
        this.scale = null;
        this.speed = null;

        this.center_global_coord = null;
        this.center_chunk_coord = null;
        this.center_hex_coord = null;
        this.global_coord = null;

    }
    
    check_center_chunk_coord(){
        const window_size = INPUT_MANAGER.get_window_size()
        this.center_global_coord = COORD_FACTORY.create_global(
            this.global_coord.x + window_size.width/2/this.scale,
            this.global_coord.y + window_size.height/2/this.scale,
        )

        let new_center_hex_coord = this.center_global_coord.toHex()
        if (!new_center_hex_coord.equal(this.center_hex_coord)){
            this.center_hex_coord = new_center_hex_coord;
            let new_center_chunk_coord = this.center_hex_coord.toChunk();
            if (!new_center_chunk_coord.equal(this.center_chunk_coord)){
                this.center_chunk_coord = new_center_chunk_coord;
                return true
            }
        }
    }
    
    update(){
        const has_moved = this.move();
        const has_zoomed = this.zoom();
        const has_resized = INPUT_MANAGER.is_window_resized();

        if (!has_resized && !has_moved && !has_zoomed) return;

        if (this.check_center_chunk_coord() || has_zoomed) {
            DRAWER_MANAGER.check_view_distance();
            WORKER_MANAGER.postMessage(
                "send_camera_coord",
                {"camera_center_chunk_coord": this.center_chunk_coord} 
            )
        };
    }
    
    move(){
        let delta_coord = COORD_FACTORY.create_global(0,0);
        if (INPUT_MANAGER.is_action_pressed("camera-move-up"))
            delta_coord.add(COORD_FACTORY.create_global(0,-this.speed))
        if (INPUT_MANAGER.is_action_pressed("camera-move-left"))
            delta_coord.add(COORD_FACTORY.create_global(-this.speed, 0))
        if (INPUT_MANAGER.is_action_pressed("camera-move-down"))
            delta_coord.add(COORD_FACTORY.create_global(0, this.speed))
        if (INPUT_MANAGER.is_action_pressed("camera-move-right"))
            delta_coord.add(COORD_FACTORY.create_global(this.speed, 0))
        if (INPUT_MANAGER.is_action_pressed("drag"))
            delta_coord.subtract(INPUT_MANAGER.get_mouse_delta_local_coord().toGlobal_delta(this))
        if (delta_coord.x == 0 && delta_coord.y == 0) return false

        this.global_coord.add(delta_coord)
        return true;
    }
    
    zoom(){
        let zoom_delta = 0;
        if (INPUT_MANAGER.is_action_just_pressed("camera-zoom-in")) zoom_delta = -1;
        if (INPUT_MANAGER.is_action_just_pressed("camera-zoom-out")) zoom_delta = 1;

        if (zoom_delta === 0) return false;
        if (zoom_delta < 0 && this.scale > this.max_scale) return false;
        if (zoom_delta > 0 && this.scale < this.min_scale) return false;

        const mouse_position = INPUT_MANAGER.get_mouse_local_coord();
        const old_global_position = mouse_position.toGlobal(this);

        this.scale = zoom_delta > 0 
            ? Math.floor(this.scale / this.zoom_factor)
            : Math.ceil(this.scale * this.zoom_factor);

        this.speed = this.speed_factor / this.scale;
        const new_global_position = mouse_position.toGlobal(this);

        this.global_coord.add(COORD_FACTORY.create_global(
            old_global_position.x - new_global_position.x,
            old_global_position.y - new_global_position.y
        ));

        return true;
    }
}

export const CAMERA_MANAGER = new CameraManager();