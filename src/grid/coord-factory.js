import { GlobalCoord } from "/src/grid/global-coord.js"
import { LocalCoord } from "/src/grid/local-coord.js"
import { ChunkCoord } from "/src/grid/chunk-coord.js"
import { HexCoord } from "/src/grid/hex-coord.js"

export class COORD_FACTORY {
    static create_global = (x, y) => new GlobalCoord(x, y); 
    static create_local = (x, y) => new LocalCoord(x, y);
    static create_chunk = (x, y) => new ChunkCoord(x, y);
    static create_hex = (x, y) => new HexCoord(x, y);
}






