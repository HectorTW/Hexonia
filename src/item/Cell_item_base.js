import { Cell_item } from "/src/item/Cell_item.js"

export class Cell_item_base extends Cell_item {
    baseIn = true
    leftMouseKeyClick(handCell) {
        const isInHand = handCell.isSlot()
        const isInTarget = this.isSlot()
        const isAnyUnstackable = handCell.isUnstackable() || this.isUnstackable()
        const isEqual = this.objectsEqual(handCell.getItem(), this.getItem())

        if (isInHand && isInTarget && isEqual) {
            let put = this.slot.addCount(handCell.slot.count)
            handCell.slot.minusCount(put)
        } else if (isInHand && isInTarget && (!isEqual || isAnyUnstackable)) {
            const timeSlot = jsonPS(handCell.getSlot())
            handCell.setSlot(...this.getSlot())
            this.setSlot(...timeSlot)
        } else if (!isInHand && isInTarget) {
            handCell.setSlot(...this.getSlot())
            this.removeSlot()
        } else if (isInHand && !isInTarget) {
            this.setSlot(...handCell.getSlot())
            handCell.removeSlot()
        }
    }
    rightMouseKeyClick(handCell) {
        const isInHand = handCell.isSlot()
        const isInTarget = this.isSlot()
        const isEqual = this.objectsEqual(handCell.getItem(), this.getItem())

        if (isInHand && isInTarget && isEqual) {
            let put = this.slot.addCount(1)
            handCell.slot.minusCount(put)
        } else if (isInHand && isInTarget && !isEqual) {
            const timeSlot = jsonPS(handCell.getSlot())
            handCell.setSlot(...this.getSlot())
            this.setSlot(...timeSlot)
        } else if (!isInHand && isInTarget) {
            let inTargetCellSlotInfo = this.getSlot()
            let take = Math.round(this.slot.count / 2)
            inTargetCellSlotInfo[0] = take
            handCell.setSlot(...inTargetCellSlotInfo)
            this.slot.minusCount(take)
        } else if (isInHand && !isInTarget) {
            let inHandCellSlotInfo = handCell.getSlot()
            inHandCellSlotInfo[0] = 1
            this.setSlot(...inHandCellSlotInfo)
            handCell.slot.minusCount(1)
        }
    }
    fastTransfer(key) {
        const keyCell = player.inventory.cells[key].cell
        const isInKey = keyCell.isSlot()
        const isInTarget = this.isSlot()

        if (isInKey && isInTarget) {
            const timeSlot = jsonPS(keyCell.getSlot())
            keyCell.setSlot(...this.getSlot())
            this.setSlot(...timeSlot)
        } else if (!isInKey && isInTarget) {
            keyCell.setSlot(...this.getSlot())
            this.removeSlot()
        } else if (isInKey && !isInTarget) {
            this.setSlot(...keyCell.getSlot())
            keyCell.removeSlot()
        }
    }
    leftMouseKeyClickFastTransfer(key) {
        const keyCell = player.inventory.cells[key].cell
        const isInKey = keyCell.isSlot()
        const isInTarget = this.isSlot()

        if (isInKey && isInTarget) {
            const timeSlot = jsonPS(keyCell.getSlot())
            keyCell.setSlot(...this.getSlot())
            this.setSlot(...timeSlot)
        } else if (!isInKey && isInTarget) {
            keyCell.setSlot(...this.getSlot())
            this.removeSlot()
        } else if (isInKey && !isInTarget) {
            this.setSlot(...keyCell.getSlot())
            keyCell.removeSlot()
        }
    }
}
