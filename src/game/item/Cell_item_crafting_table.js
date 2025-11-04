import { Cell_item_base } from "/src/game/item/Cell_item_base.js"

export class Cell_item_crafting_table extends Cell_item_base {
    setCraftingResult() {
        let massiv = this.INVENTORY.cells.map((element) => (element.slot.id ? element.slot.id : null))
        massiv.pop()
        console.log(massiv)
        let result = craftingResult(massiv)
        if (result) {
            this.INVENTORY.cells[9].setSlot(result["count"], result["id"])
        } else {
            this.INVENTORY.cells[9].removeSlot()
        }
    }
}
