import { SAVE_DB_MANAGER } from "/src/worker/manager-saveDB.js"

export class Inventory {
    constructor(inventory_data) {
        this.inventory_type = inventory_data["inventory_type"];
        this.extra_information = inventory_data["extra_information"] || {};
        this.slots_data = inventory_data["slots_data"] || [[1,10, {}], [2,16, {}]];
        this.isChanges = false;
    }
}