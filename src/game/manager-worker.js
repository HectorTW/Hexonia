import { DRAWER_MANAGER } from "/src/game/manager-drawer.js"
import { HUD_MANAGER } from "/src/game/manager-hud.js"

class WorkerManager {
    constructor() {
        this.workerObject = null;
    }
    async initialize(save_name){
        this.workerObject = new Worker("/private-worker.js", { type: "module" });
        await this.postMessageAndWait(
            "initialize_worker_object",
            {"save_name": save_name},
            "initialize_worker_object_done",
        )
        this.setDefault();
    }
    close(){}
    setDefault(){
        this.workerObject.onmessage = (event) => {
            const { type, data } = event.data;
            switch (type) {
                case "get_chunk_data_done":
                    const chunk_coord_name = data.chunk_coord_name;
                    const chunk_data = data.chunk_data;
                    DRAWER_MANAGER.receivedChunksList[chunk_coord_name] = chunk_data;
                    break;
                case "get_inventorys_data_done":
                    const inventory_id = data.inventory_id;
                    const inventory_data = data.inventory_data;

                    const HUD_container = HUD_MANAGER.HUD_container;
                    for (let index = 0; index < HUD_container.length; index++) {
                        const HUD = HUD_container[index];
                        if (HUD.inventory_id == inventory_id){
                            HUD.setData(inventory_data);
                        }
                    }
                    break;
            }
        };
    }
    postMessage(type, data){
        this.workerObject.postMessage({
            "type": type,
            "data": data,
        });
    }
    async postMessageAndWait(type, data, wait_for_type){
        this.workerObject.postMessage({ 
            "type": type,
            "data": data,
        })
        await new Promise((resolve) => {
            this.workerObject.onmessage = (event) => {
                if (event.data.type === wait_for_type) resolve();
            };
        });
        this.setDefault();
    }

}

export const WORKER_MANAGER = new WorkerManager();