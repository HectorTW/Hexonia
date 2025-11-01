// import { SAVE_DB_MANAGER } from '/src/worker/manager-saveDB.js';
import { INVENTORYS_MANAGER } from '/src/worker/manager-inventorys.js';
import { RESOURCES_MANAGER } from '/src/main/manager-resources.js';
import { ID_MANAGER } from '/src/main/manager-id.js';

import { Chunk } from '/src/worker/chunk.js';

const GTC = n => ((n % 16) + 16) % 16;

export class World{
    constructor() {
        this.chunkData = {};
    }
    async loadChunk(coord_x, coord_y, chunk_coord_name, isAwait = false){
        if (this.chunkData[chunk_coord_name]) return;
        this.chunkData[chunk_coord_name] = new Chunk(coord_x, coord_y, chunk_coord_name);
        if (isAwait){
            await this.chunkData[chunk_coord_name].init();
        } else {
            this.chunkData[chunk_coord_name].init();
        }
    }
    unloadChunk(chunk_coord_name){
        if (!this.chunkData[chunk_coord_name]) return;
        delete this.chunkData[chunk_coord_name];
    }
    genHexDev(x, y) {
        const x16 = x >> 4;
        const y16 = y >> 4;
        const color1 = (x16 + y16) & 1 ? ID_MANAGER.get_block_id("base:cobblestone") : ID_MANAGER.get_block_id("base:stone");
        const color2 = (x & 15) && (y & 15) ? ID_MANAGER.get_block_id("base:aer") : ID_MANAGER.get_block_id("base:dirt");
        return [color1, color2];
    }
    
    setBlock(x, y, z, id){
        const chunk = this.chunkData[(x >> 4) + "," + (y >> 4)];
        if (!chunk) return
        const block_name = ID_MANAGER.get_block_name(id);
        const block = RESOURCES_MANAGER.getBlock(block_name);
        const chunk_coord_x = GTC(x);
        const chunk_coord_y = GTC(y);

        // Inventory
        const inventory_type = block["inventory"];
        if (inventory_type){
            const chunk_coord_name = chunk_coord_x + "," + chunk_coord_y;
            const inventory_id = INVENTORYS_MANAGER.create_new_inventory(inventory_type);
            const chunkExtraData = chunk.extraData;
            if (!chunkExtraData[chunk_coord_name]) chunkExtraData[chunk_coord_name] = {};
            chunkExtraData[chunk_coord_name]["inventory_id"] = inventory_id;
        }
        
        chunk.setBlockId(chunk_coord_x, chunk_coord_y, z, id);
        chunk.setBlockMeta(chunk_coord_x, chunk_coord_y, z, 0);
    }
    getBlockId(x, y, z){
        const chunk = this.chunkData[(x >> 4) + "," + (y >> 4)]
        if (!chunk) return
        return chunk.getBlockId(GTC(x), GTC(y), z);
    }

}