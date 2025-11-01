import { INVENTORYS_MANAGER } from '/src/worker/manager-inventorys.js';
import { RESOURCES_MANAGER } from '/src/main/manager-resources.js';
import { SAVE_DB_MANAGER } from '/src/worker/manager-saveDB.js';
import { ID_MANAGER } from '/src/main/manager-id.js';

import { Engine } from '/src/worker/engine.js';
import * as logic from '/src/worker/logic.js';

self.engine = null;
console.log('WORKER :>> start');
self.onmessage = async function(event) {
    const { type, data } = event.data;
    switch (type) {
        case "initialize_worker_object":
            const save_name = data.save_name
            await RESOURCES_MANAGER.initialize({
                "block": true,
                "inventorys": true,
            });
            await SAVE_DB_MANAGER.initialize("save:" + save_name);
            await INVENTORYS_MANAGER.initialize(self);
            await ID_MANAGER.initialize();
            await SAVE_DB_MANAGER.initDB();
            self.engine = new Engine(self);
            await self.engine.init();
            self.postMessage({
                type: "initialize_worker_object_done"
            });
            break;
        case "save_and_quit":
            const preview_screenshot = data.preview_screenshot;
            await SAVE_DB_MANAGER.setItem("info", "preview", preview_screenshot);
            self.postMessage({
                type: "save_and_quit_done"
            });
            self.close();
            break;
        case "get_chunk_data":
            self.engine.requestChunkData(data.chunk_coord_name);
            break;
        case "send_camera_coord":
            self.engine.heroes[0].camera_center_chunk_coord = data.camera_center_chunk_coord;
            break;
        case "pkm_on_block":
            logic.player_pkm_on_block(0, data.hex_coord_data.x, data.hex_coord_data.y);
            break;
        case "lkm_on_block":
            logic.player_lkm_on_block(0, data.hex_coord_data.x, data.hex_coord_data.y);
            break;
        case "lkm_on_cell":
            if (data.inventory_id == null) return
            logic.player_lkm_on_cell(0, data.inventory_id, data.cell_id);
            break;
        case "pkm_on_cell":
            if (data.inventory_id == null) return
            logic.player_pkm_on_cell(0, data.inventory_id, data.cell_id);
            break;
        case "inventorys_subscription":
            INVENTORYS_MANAGER.inventorys_subscription = data.array;
            break;

        default:
            console.warn('Unknown message type:', type);
            break;
    }
};






