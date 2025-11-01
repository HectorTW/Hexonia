import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"

import { CAMERA_MANAGER } from "/src/game/manager-camera.js"

export class COORD_FACTORY {
    static create_global = (x, y) => new GlobalCoord(x, y); 
    static create_local = (x, y) => new LocalCoord(x, y);
    static create_chunk = (x, y) => new ChunkCoord(x, y);
    static create_hex = (x, y) => new HexCoord(x, y);
}

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
export class HexCoord {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toChunk() {
        return new ChunkCoord(
            Math.floor(this.x/HEX_PROP_MANAGER .chunkDepth),
            Math.floor(this.y/HEX_PROP_MANAGER .chunkDepth)
        )
    }
    toGlobal(){
        return new GlobalCoord(
            HEX_PROP_MANAGER .hexRatio * (this.x - Math.floor(this.y / 2) + this.y / 2),
            0.75 * this.y
        )
    }
    toHexInChunk(){
        return new HexCoord(
            this.x - Math.floor(this.x/HEX_PROP_MANAGER .chunkDepth) * HEX_PROP_MANAGER .chunkDepth,
            this.y - Math.floor(this.y/HEX_PROP_MANAGER .chunkDepth) * HEX_PROP_MANAGER .chunkDepth,
        )
    }
    equal(hexCoord){
        if (hexCoord instanceof HexCoord) {
            if (this.x != hexCoord.x) return false
            if (this.y != hexCoord.y) return false
            return true
        }
        return false
    }
    getNeighbors(){
        const answer = {}
        const neighbors = HEX_PROP_MANAGER .neighbors[this.y % 2]
        for (let i = 0; i < 6; i++){
            const x = this.x + neighbors[i][0]
            const y = this.y + neighbors[i][1]
            answer[x + "," + y] = new HexCoord(x, y);
        }
        return answer
    }
    getDistanceFromHex(hex_coord){
        let x1 = this.x - Math.floor(this.y / 2);
        let z1 = this.y;
        let y1 = -x1 - z1;

        let x2 = hex_coord.x - Math.floor(hex_coord.y / 2);
        let z2 = hex_coord.y;
        let y2 = -x2 - z2;

        let distance = (Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)) / 2;
        
        return distance;
    }
}
export class ChunkCoord {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getString(){
        return this.x + "," + this.y
    }
    equal(chunk_coord){
        if (chunk_coord instanceof ChunkCoord) {
            if (this.x != chunk_coord.x) return false
            if (this.y != chunk_coord.y) return false
            return true
        }
        return false
    }
    toGlobal(){
        return new GlobalCoord(
            this.x * HEX_PROP_MANAGER .chunkDepth * HEX_PROP_MANAGER .hexRatio,
            this.y * HEX_PROP_MANAGER .chunkDepth * 0.75
        )
    }
}





