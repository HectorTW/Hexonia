import { Cell_item_crafting_table } from "/src/game/item/Cell_item_crafting_table.js"

export class Cell_item_crafting_table_base extends Cell_item_crafting_table {
    leftMouseKeyClick() {
        super.leftMouseKeyClick()
        this.setCraftingResult()
    }
    rightMouseKeyClick() {
        super.rightMouseKeyClick()
        this.setCraftingResult()
    }
    fastTransfer(key) {
        super.fastTransfer(key)
        this.setCraftingResult()
    }
}
