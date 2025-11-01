import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"

class IDManager{
    constructor() {
        this.block_id_to_name = {};
        this.block_name_to_id = {};
        this.item_id_to_name = {};
        this.item_name_to_id = {};

        this.block_id_digits_length = null;
        this.item_id_digits_length = null;
    }
    initialize(){
        console.group("%cIDManager :>> initialize", "background-color: green; font-weight: bold");
        const blocks_names = Object.keys(RESOURCES_MANAGER.block_container).sort();
        const items_names = Object.keys(RESOURCES_MANAGER.item_container).sort();

        for (let index = 0; index < blocks_names.length; index++) {
            const key = blocks_names[index];
            this.block_id_to_name[index] = key;
            this.block_name_to_id[key] = index;
            this.item_id_to_name[index] = key;
            this.item_name_to_id[key] = index;
        }
        
        for (let index = 0; index < items_names.length; index++) {
            const key = items_names[index];
            this.item_id_to_name[index + blocks_names.length] = key;
            this.item_name_to_id[key] = index + blocks_names.length;
        }


        this.block_id_digits_length = Object.keys(this.block_id_to_name).length.toString(2).length;
        this.item_id_digits_length = Object.keys(this.item_id_to_name).length.toString(2).length;

        console.log("%cIDManager :>>", "color: green", Object.keys(this.block_id_to_name).length, "block id amount");
        console.log("%cIDManager :>>", "color: green", Object.keys(this.item_id_to_name).length, "item id amount");
        console.log("%cIDManager :>>", "color: green", this.block_id_digits_length, "block id size");
        console.log("%cIDManager :>>", "color: green", this.item_id_digits_length, "item id size");
        console.log("%cIDManager :>>", "color: green", this);
        console.groupEnd();
    }
    get_block_id(block_name){
        return this.block_name_to_id[block_name];
    }
    get_block_name(block_id){
        return this.block_id_to_name[block_id];
    }
    get_item_id(item_name){
        return this.item_name_to_id[item_name];
    }
    get_item_name(item_id){
        return this.item_id_to_name[item_id];
    }
}

export const ID_MANAGER = new IDManager()

