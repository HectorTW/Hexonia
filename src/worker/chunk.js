import { SAVE_DB_MANAGER } from '/src/worker/manager-saveDB.js';

export class Chunk{
    constructor(coord_x, coord_y, coord_name) {
        this.coord_x = coord_x;
        this.coord_y = coord_y;
        this.coord_name = coord_name;
        this.hexData = null;
        this.extraData = null;
        this.isChanges = false;
    }
    async init(){
        this.hexData = await SAVE_DB_MANAGER.getItem("hexData", this.coord_name);
        if (!this.hexData){
            this.hexData = new Uint8Array(1024);
            let i = 0;
            for (let x = 0; x < 16; x++){
                for (let y = 0; y < 16; y++){
                    const blocks = self.engine.world.genHexDev(this.coord_x * 16 + x, this.coord_y * 16 + y);
                    this.hexData[i + 0] = blocks[0];
                    this.hexData[i + 1] = 0;
                    this.hexData[i + 2] = blocks[1];
                    this.hexData[i + 3] = 0;
                    i += 4;
                }
            }
        }
        this.extraData = await SAVE_DB_MANAGER.getItem("extraData", this.coord_name) || {};
        this.isChanges = true;
    }
    getBlockIndex = (x, y, z) => 2 * (32 * x + 2 * y + z);
    getBlockId = (x, y, z) => this.hexData[this.getBlockIndex(x, y, z)]
    setBlockId = (x, y, z, id) => {
        this.hexData[this.getBlockIndex(x, y, z)] = id;
        this.isChanges = true;
    }
    getBlockMeta = (x, y, z) => this.hexData[this.getBlockIndex(x, y, z) + 1]
    setBlockMeta = (x, y, z, meta) => {
        this.hexData[this.getBlockIndex(x, y, z) + 1] = meta;
        this.isChanges = true;
    }
}