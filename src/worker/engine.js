import { INVENTORYS_MANAGER } from '/src/worker/manager-inventorys.js';
import { SAVE_DB_MANAGER } from '/src/worker/manager-saveDB.js';
import { ID_MANAGER } from '/src/main/manager-id.js';

import { World } from "/src/worker/world.js"
import { Hero } from "/src/worker/hero.js"

import { COORD_FACTORY } from "/src/game/grid/coord-factory.js"

export class Engine {
    constructor (worker){
        this.worker = worker;
        this.world = null;
        this.heroes = [];
        this.settings = {
            "chunk-load-distance": 7,
            "chunk-unload-distance": 15,
            "chunk-path-map-distance": 2,
        }
        this.tickCount = 0;
        this.tick = null;
    }
    async init(){
        this.world = new World();
        this.heroes.push(new Hero(COORD_FACTORY.create_hex(10, 10)));
        await this.checkLoadChunks(true);
        this.world.setBlock(3, 3, 1, ID_MANAGER.get_block_id("base:base_core"));
        this.tick = setInterval(this.update, 10);
    }
    async loadChunksFromCenter(chunk_coord, isAwait = false){
        const centerX = chunk_coord.x;
        const centerY = chunk_coord.y;
        const addDist = this.settings["chunk-load-distance"];
        const addMinX = centerX - addDist + 1;
        const addMaxX = centerX + addDist;
        const addMinY = centerY - addDist + 1;
        const addMaxY = centerY + addDist;
        for (let x = addMinX; x < addMaxX; x++) {
            for (let y = addMinY; y < addMaxY; y++) {
                const chunk_coord_name = x + "," + y;
                const chunk = this.world.chunkData[chunk_coord_name];
                if (!chunk) {
                    if (isAwait){
                        await this.world.loadChunk(x, y, chunk_coord_name, true);
                    } else {
                        this.world.loadChunk(x, y, chunk_coord_name, false);
                    }
                } else if (chunk.isChanges){
                    chunk.isChanges = false;
                    this.worker.postMessage({ 
                        "type": 'get_chunk_data_done',
                        "data": {
                            "chunk_coord_name": chunk_coord_name,
                            "chunk_data": chunk.hexData,
                        } 
                    });
                    SAVE_DB_MANAGER.setItem("hexData", chunk_coord_name, chunk.hexData);
                    SAVE_DB_MANAGER.setItem("extraData", chunk_coord_name, chunk.extraData);
                }
            }
        }
    }
    async checkLoadChunks(isAwait = false) {
        for (const hero of this.heroes) {
            const operations = [
                this.loadChunksFromCenter(hero.getHeroChunkCoord(), isAwait),
                this.loadChunksFromCenter(hero.getCameraChunkCoord(), isAwait)
            ];
            
            if (isAwait) {
                await Promise.all(operations);
            }
        }
    }
    checkUnloadChunks(){
        const heroes = this.heroes;
        const needToUnloadChunksList = {};
        for (const chunk_coord_name in this.world.chunkData) {
            needToUnloadChunksList[chunk_coord_name] = true;
        }
        for (let i = 0; i < heroes.length; i++){
            const chunk_coord = heroes[i].getHeroChunkCoord();
            const centerX = chunk_coord.x;
            const centerY = chunk_coord.y;
            const removeDist = this.settings["chunk-unload-distance"];
            const removeMinX = centerX - removeDist;
            const removeMaxX = centerX + removeDist;
            const removeMinY = centerY - removeDist;
            const removeMaxY = centerY + removeDist;
            for (const chunk_coord_name in this.world.chunkData) {
                const coord_x = this.world.chunkData[chunk_coord_name].coord_x;
                const coord_y = this.world.chunkData[chunk_coord_name].coord_y;
                if ((
                    coord_x > removeMinX &&
                    coord_x < removeMaxX &&
                    coord_y > removeMinY &&
                    coord_y < removeMaxY
                )) {
                    needToUnloadChunksList[chunk_coord_name] = false;
                }
            }
        }
        for (let i = 0; i < heroes.length; i++){
            const chunk_coord = heroes[i].getCameraChunkCoord();
            const centerX = chunk_coord.x;
            const centerY = chunk_coord.y;
            const removeDist = this.settings["chunk-unload-distance"];
            const removeMinX = centerX - removeDist;
            const removeMaxX = centerX + removeDist;
            const removeMinY = centerY - removeDist;
            const removeMaxY = centerY + removeDist;
            for (const chunk_coord_name in this.world.chunkData) {
                const coord_x = this.world.chunkData[chunk_coord_name].coord_x;
                const coord_y = this.world.chunkData[chunk_coord_name].coord_y;
                if ((
                    coord_x > removeMinX &&
                    coord_x < removeMaxX &&
                    coord_y > removeMinY &&
                    coord_y < removeMaxY
                )) {
                    needToUnloadChunksList[chunk_coord_name] = false;
                }
            }
        }
        for (const chunk_coord_name in needToUnloadChunksList) {
            if (needToUnloadChunksList[chunk_coord_name] == true) this.world.unloadChunk(chunk_coord_name);
        }
    }
    update = () => {
        if (this.tickCount % 20 == 0) {
            for (let i = 0; i < this.heroes.length; i++){
                const hero = this.heroes[i]
                hero.update50ps();
            }
            this.checkLoadChunks();
            INVENTORYS_MANAGER.update();
        }
        if (this.tickCount % 1000 == 0) {
            INVENTORYS_MANAGER.save_all_inventorys();
            this.checkUnloadChunks();
        }

    }
    
    requestChunkData(chunk_coord_name){
        const chunk = this.world.chunkData[chunk_coord_name];
        const chunk_data = chunk.hexData;
        if (!chunk) return;
        this.worker.postMessage({ 
            "type": 'get_chunk_data_done',
            "data": {
                "chunk_coord_name": chunk_coord_name,
                "chunk_data": chunk_data,
            } 
        });
    }



}