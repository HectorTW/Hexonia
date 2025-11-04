import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"

import { CAMERA_MANAGER } from "/src/game/manager-camera.js"

import { LocalCoord } from "/src/game/grid/local-coord.js"
import { HexCoord } from "/src/game/grid/hex-coord.js"

export class GlobalCoord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(global_coord){
        this.x += global_coord.x;
        this.y += global_coord.y;
    }
    subtract(global_coord){
        this.x -= global_coord.x;
        this.y -= global_coord.y;
    }
    toHex() {
        let hex_x = this.x / HEX_PROP_MANAGER .hexRatio - this.y / 1.5
        let hex_y = this.y / 0.75
    
        let round_hex_x = Math.round(hex_x)
        let round_hex_y = Math.round(hex_y)
        let round_hex_z = Math.round(-hex_x - hex_y)
    
        let x_diff = Math.abs(hex_x - round_hex_x)
        let y_diff = Math.abs(hex_y - round_hex_y)
        let z_diff = Math.abs(-hex_x - hex_y - round_hex_z)
    
        if (x_diff > y_diff && x_diff > z_diff) {
            round_hex_x = -round_hex_y - round_hex_z
        } else if (y_diff > z_diff) {
            round_hex_y = -round_hex_x - round_hex_z
        }
    
        return new HexCoord(round_hex_x + Math.floor(round_hex_y / 2), round_hex_y)
    }
    toLocal(){
        return new LocalCoord(
            (this.x - CAMERA_MANAGER.global_coord.x) * CAMERA_MANAGER.scale,
            (this.y - CAMERA_MANAGER.global_coord.y) * CAMERA_MANAGER.scale
        )
    }
    equal(global_coord){
        if (global_coord instanceof GlobalCoord) {
            if (Math.abs(this.x - global_coord.x) > 0.001) return false
            if (Math.abs(this.y - global_coord.y) > 0.001) return false
            return true
        }
        return false
    }
}