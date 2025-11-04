import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"

import { GlobalCoord } from "/src/game/grid/global-coord.js"

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