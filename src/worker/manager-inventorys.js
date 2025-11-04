import { SAVE_DB_MANAGER } from "/src/worker/manager-saveDB.js"
import { ObjectContainer } from "/src/staf/objectContainer.js"
import { Inventory } from "/src/game/item/Inventory.js"

class Inventorys_manager{
    constructor(){
        this.inventorys_container = null;
        this.inventorys_subscription = [];
    }
    async initialize(worker){
        this.worker = worker;
        const free_id = await SAVE_DB_MANAGER.getItem("inventorys-data", "data:free_id") || 1;
        await SAVE_DB_MANAGER.setItem("inventorys-data", "data:free_id", free_id);
        this.inventorys_container = new ObjectContainer(free_id);
    }
    update(){
        for (let index = 0; index < this.inventorys_subscription.length; index++) {
            const inventory_id = this.inventorys_subscription[index];
            const inventory = this.inventorys_container.getObject(inventory_id)
            if (inventory && inventory.isChanges) {
                this.worker.postMessage({ 
                    "type": 'get_inventorys_data_done',
                    "data": {
                        "inventory_id": inventory_id,
                        "inventory_data": inventory.getData(),
                    } 
                });
            }
            inventory.isChanges = false;
        }
    }
    async save_all_inventorys(){
        const array = this.inventorys_container.getAllIds();
        for (let index = 0; index < array.length; index++) {
            const inventory_id = array[index];
            if (this.inventorys_container.getObject(inventory_id).isChanges){
                await this.save_inventory(inventory_id);
            }
        }
    }
    async load_inventory(inventory_id){
        const inventory_data = await SAVE_DB_MANAGER.getItem("inventorys-data");
        this.inventorys_container.addObject(inventory_id, new Inventory(inventory_data, inventory_id));
    }
    async save_inventory(inventory_id){
        const inventory_data = this.inventorys_container.getObject(inventory_id).getData();
        await SAVE_DB_MANAGER.setItem("inventorys-data", inventory_id, inventory_data);
    }
    create_new_inventory(inventory_type_name){
        const inventory_id = this.inventorys_container.getFreeId();
        this.inventorys_container.addObject(inventory_id, new Inventory({"inventory_type_name": inventory_type_name}));
        return inventory_id;
    }
    get_inventory(inventory_id){
        return this.inventorys_container.getObject(inventory_id);
    }

}

export const INVENTORYS_MANAGER = new Inventorys_manager();