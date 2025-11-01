import { RESOURCES_MANAGER } from '/src/main/manager-resources.js';
import { ID_MANAGER } from '/src/main/manager-id.js';

export class Slot {
    constructor() {}
    set(count, id, meta = null) {
        this.count = count
        this.id = id
        if (meta === null && RESOURCES_MANAGER.getBlock(ID_MANAGER.get_item_name(this.id)).hasOwnProperty("metaItem")) meta = jsonPS(ATLAS_ITEMS[id]["metaItem"])
        this.meta = meta
    }
    addCount(amount) {
        let maxCountStack = RESOURCES_MANAGER.getBlock(ID_MANAGER.get_item_name(this.id)).maxCountStack
        let put
        if (amount + this.count > maxCountStack) {
            put = maxCountStack - this.count
            this.count = maxCountStack
        } else {
            this.count += amount
            put = amount
        }
        this.CELL &&
            this.CELL.INVENTORY &&
            this.CELL.INVENTORY.OWNER &&
            this.CELL.INVENTORY.OWNER.update &&
            this.CELL.INVENTORY.OWNER.update("base")
        return put
    }
    minusCount(amount) {
        if (amount < 1) return 0
        let minus = Math.min(this.count, amount)
        this.count -= amount
        if (this.count < 1) this.destroy()
        this.CELL &&
            this.CELL.INVENTORY &&
            this.CELL.INVENTORY.OWNER &&
            this.CELL.INVENTORY.OWNER.update &&
            this.CELL.INVENTORY.OWNER.update("base")
        return minus
    }
    minusDurability(damage) {
        if (!this.meta.durability) return false
        this.meta.durability -= damage
        if (this.meta.durability < 1) this.CELL.removeSlot()
        return true
    }
    howMuchCanBeAdded(slot) {
        if (!this.objectsEqual([this.id, this.meta], [slot.id, slot.meta])) return 0
        let maxCountStack = RESOURCES_MANAGER.getBlock(ID_MANAGER.get_item_name(this.id))["maxCountStack"]
        return maxCountStack - this.count
    }
    destroy() {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                delete this[prop]
            }
        }
    }
}
