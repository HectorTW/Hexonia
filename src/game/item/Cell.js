import { RESOURCES_MANAGER } from '/src/main/manager-resources.js';
import { ID_MANAGER } from '/src/main/manager-id.js';
import { Slot } from "/src/item/Slot.js"

export class Cell {
    slot
    INVENTORY
    constructor(inventory) {
        this.INVENTORY = inventory;
        this.slot = new Slot();
    }
    setSlot(count, id, meta = null) {
        if (count < 1) return;
        this.slot.set(count, id, (meta = null));
        this.INVENTORY.isChanges = true;
    }
    getSlot() {
        return [this.slot.count, this.slot.id, this.slot.meta];
    }
    getItem() {
        if (this.slot) return [this.slot.id, this.slot.meta];
        return false;
    }
    removeSlot() {
        this.slot.destroy();
        this.INVENTORY.isChanges = true;
    }
    isUnstackable() {
        if (this.isSlot() && RESOURCES_MANAGER.getBlock(ID_MANAGER.get_item_name(this.slot.id)).maxCountStack < 2) return true;
        return false;
    }
    isSlot() {
        if (this.slot.id) return true;
        return false;
    }
}
