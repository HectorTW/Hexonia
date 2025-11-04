import { CAMERA_MANAGER } from "/src/game/manager-camera.js"

import { GlobalCoord } from "/src/game/grid/global-coord.js"

export class LocalCoord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toGlobal(){
        return new GlobalCoord(
            this.x /CAMERA_MANAGER.scale + CAMERA_MANAGER.global_coord.x,
            this.y /CAMERA_MANAGER.scale + CAMERA_MANAGER.global_coord.y,
        )
    }
    toGlobal_delta(){
        return new GlobalCoord(
            this.x /CAMERA_MANAGER.scale,
            this.y /CAMERA_MANAGER.scale,
        )
    }
    equal(local_coord){
        if (Math.abs(this.x - local_coord.x) > 0.001) return false
        if (Math.abs(this.y - local_coord.y) > 0.001) return false
        return true
    }
}