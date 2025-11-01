import { Cell_item } from "/src/item/Cell_item.js"

export class Cell_item_nei extends Cell_item {
    drawCell(ctx, size) {
        super.drawCell(ctx, size, true)
    }
    leftMouseKeyClick() {
        const handCell = player.mouse.handCell

        let inTargetCellSlotInfo = this.getSlot()
        let take = ATLAS_ITEMS[this.slot.id].maxCountStack
        inTargetCellSlotInfo[0] = take
        handCell.setSlot(...inTargetCellSlotInfo)
    }
}
