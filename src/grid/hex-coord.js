import { HEX_PROP_MANAGER} from "/src/main/manager-hexProp.js"

import { GlobalCoord } from "/src/grid/global-coord.js"
import { ChunkCoord } from "/src/grid/chunk-coord.js"

export class HexCoord {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toChunk() {
        return new ChunkCoord(
            Math.floor(this.x/HEX_PROP_MANAGER.chunkDepth),
            Math.floor(this.y/HEX_PROP_MANAGER.chunkDepth)
        )
    }
    toGlobal(){
        return new GlobalCoord(
            HEX_PROP_MANAGER.hexRatio * (this.x - Math.floor(this.y / 2) + this.y / 2),
            0.75 * this.y
        )
    }
    toHexInChunk(){
        return new HexCoord(
            this.x - Math.floor(this.x/HEX_PROP_MANAGER.chunkDepth) * HEX_PROP_MANAGER.chunkDepth,
            this.y - Math.floor(this.y/HEX_PROP_MANAGER.chunkDepth) * HEX_PROP_MANAGER.chunkDepth,
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
        const neighbors = HEX_PROP_MANAGER.neighbors[this.y % 2]
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