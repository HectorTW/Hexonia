import { Cell_item } from "/src/item/Cell_item.js"

export class Cell_item_out extends Cell_item {
    leftMouseKeyClick() {
        const handCell = player.mouse.handCell
        const isInHand = handCell.isSlot()
        const isInTarget = this.isSlot()
        const isEqual = this.objectsEqual(handCell.getItem(), this.getItem())

        if (isInHand && isInTarget && isEqual) {
            let put = handCell.slot.addCount(this.slot.count)
            this.slot.minusCount(put)
        } else if (!isInHand && isInTarget) {
            handCell.setSlot(...this.getSlot())
            this.removeSlot()
        }
    }
    rightMouseKeyClick() {
        const handCell = player.mouse.handCell
        const isInHand = handCell.isSlot()
        const isInTarget = this.isSlot()

        if (!isInHand && isInTarget) {
            let inTargetCellSlotInfo = this.getSlot()
            let take = Math.round(this.slot.count / 2)
            inTargetCellSlotInfo[0] = take
            handCell.setSlot(...inTargetCellSlotInfo)
            this.slot.minusCount(take)
        }
    }
    fastTransfer(key) {
        const keyCell = player.inventory.cells[key]
        const isInKey = keyCell.isSlot()
        const isInTarget = this.isSlot()

        if (!isInKey && isInTarget) {
            keyCell.setSlot(...this.getSlot())
            this.removeSlot()
        }
    }
}
