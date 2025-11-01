import { Cell_item_crafting_table } from "/src/item/Cell_item_crafting_table.js"

export class Cell_item_crafting_table_out extends Cell_item_crafting_table {
    leftMouseKeyClick() {
        const handCell = player.mouse.handCell
        const isInHand = handCell.isSlot()
        const isInTarget = this.isSlot()
        const isAnyUnstackable = handCell.isUnstackable() || this.isUnstackable()
        const isEqual = this.objectsEqual(handCell.getItem(), this.getItem())

        if (!player.isShiftDown) {
            if (isInHand && isInTarget && isEqual && !isAnyUnstackable) {
                if (handCell.slot.howMuchCanBeAdded(this.slot) >= this.slot.count) {
                    handCell.slot.addCount(this.slot.count)
                    this.minusRecepy()
                    this.setCraftingResult()
                }
            } else if (!isInHand && isInTarget) {
                handCell.setSlot(...this.getSlot())
                this.minusRecepy()
                this.setCraftingResult()
            }
        } else {
            let put = true
            while (isInTarget && put === true) {
                put = player.inventory.addSlot(this.slot, "baseIn")
                if (put) {
                    this.minusRecepy()
                    this.setCraftingResult()
                }
            }
        }
    }
    minusRecepy() {
        for (let i = 0; i < 9; i++) {
            if (this.INVENTORY.cells[i].slot.id) {
                this.INVENTORY.cells[i].slot.minusCount(1)
            }
        }
    }
}
