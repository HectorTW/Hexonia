import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { ID_MANAGER } from '/src/main/manager-id.js';

import { Cell_item_base } from "/src/game/item/Cell_item_base.js"
import { Cell_item_cook_in_fuel } from "/src/game/item/Cell_item_cook_in_fuel.js"
import { Cell_item_cook_in } from "/src/game/item/Cell_item_cook_in.js"
import { Cell_item_cook_out } from "/src/game/item/Cell_item_cook_out.js"
import { Cell_item_crafting_table_base } from "/src/game/item/Cell_item_crafting_table_base.js"
import { Cell_item_crafting_table_out } from "/src/game/item/Cell_item_crafting_table_out.js"
import { Cell_item_crafting_table } from "/src/game/item/Cell_item_crafting_table.js"
import { Cell_item_hand } from "/src/game/item/Cell_item_hand.js"
import { Cell_item_nei } from "/src/game/item/Cell_item_nei.js"
import { Cell_item_out } from "/src/game/item/Cell_item_out.js"
import { Cell_item } from "/src/game/item/Cell_item.js"
import { Cell_liquid } from "/src/game/item/Cell_liquid.js"
import { Cell } from "/src/game/item/Cell.js"

const CELL_CLASS_REGISTRY = {
    Cell_item_base,
    Cell_item_cook_in_fuel,
    Cell_item_cook_in,
    Cell_item_cook_out,
    Cell_item_crafting_table_base,
    Cell_item_crafting_table_out,
    Cell_item_crafting_table,
    Cell_item_hand,
    Cell_item_nei,
    Cell_item_out,
    Cell_item,
    Cell_liquid,
    Cell,
};

export class Inventory {
    constructor(obj) {
        this.cells = [];
        this.inventory_type = obj.inventory_type_name;
        this.extra_information = obj.extra_information;
        const inventory_type_array = RESOURCES_MANAGER.getInventory(obj.inventory_type_name);
        for (let index = 0; index < inventory_type_array.length; index++) {
            this.cells[index] = new CELL_CLASS_REGISTRY[inventory_type_array[index]](this);
        }
        this.isChanges = true;
        this.cells[2].setSlot(64, ID_MANAGER.get_block_id("base:stone"))
    }
    getData(){
        const cells = [];
        for (let index = 0; index < this.cells.length; index++) {
            const element = this.cells[index].slot;
            cells.push(element);
        }
        const inventory_data = {
            "extra_information": this.extra_information,
            "inventory_type": this.inventory_type,
            "cells": cells,
        }
        return inventory_data
    }
    howMuchOfSlotCanBeAdded(slot, type) {
        // Пройдётся по всем ячейкам и положит предмет в свободный слот
        for (let cell of this.cells) {
            if (cell[type] && !cell.isSlot()) {
                return 10000
            }
        }
        // Пройдётся по всем ячейкам и посчитает сколько положит предмет в слот если в слоте такой же предмет
        let amount = 0
        for (let cell of this.cells) {
            if (cell[type] && cell.isSlot()) {
                amount += cell.slot.howMuchCanBeAdded(slot)
            }
        }
        return amount
    }
    addSlot(slot, type) {
        if (this.howMuchOfSlotCanBeAdded(slot, type) < slot.count) return false
        // Пройдётся по всем ячейкам и положит предмет в слот если в слоте такой же предмет
        for (let cell of this.cells) {
            if (cell[type] && cell.isSlot()) {
                let canBeAdded = cell.slot.howMuchCanBeAdded(slot)
                if (canBeAdded > 0) {
                    slot.minusCount(cell.slot.addCount(slot.count))
                    if (!slot.id) {
                        this.updateOwner()
                        return true
                    }
                }
            }
        }
        // Пройдётся по всем ячейкам и положит предмет в свободный слот
        for (let cell of this.cells) {
            if (cell[type] && !cell.isSlot()) {
                cell.setSlot(slot.count, slot.id, slot.meta)
                this.updateOwner()
                return true
            }
        }
        return false
    }
    extractItems(type) {
        let list = {}
        for (let i = 0; i < this.cells.length; i++) {
            if (!this.cells[i][type]) continue
            const slot = this.cells[i].slot
            if (!slot) continue
            if (list.hasOwnProperty(slot.id)) {
                list[slot.id] += slot.count
            } else {
                list[slot.id] = slot.count
            }
        }
        return list
    }
    minusItems(itemList, type) {
        for (let key in itemList) {
            for (let i = 0; i < this.cells.length; i++) {
                if (!this.cells[i][type]) continue
                const slot = this.cells[i].slot
                if (slot.id !== key) continue
                itemList[key] -= slot.minusCount(itemList[key])
                if (itemList[key] == 0) break
            }
        }
        this.isChanges = true;
    }
    updateOwner() {
        if (!this.coord) return
        world.addBlockToUpdateList(this.coord)
    }
}

// Параметры для начального инвентаря
function startInventory() {
    player.inventory.cells[0].setSlot(2, "crafting_table")
    player.inventory.cells[1].setSlot(64, "furnace")
    player.inventory.cells[2].setSlot(64, "stone")
    player.inventory.cells[3].setSlot(1, "stone_pickaxe")
    player.inventory.cells[4].setSlot(1, "stone_pickaxe")
    player.inventory.cells[5].setSlot(64, "oak_sapling")
    player.inventory.cells[6].setSlot(64, "sand")
    player.inventory.cells[7].setSlot(64, "sand")
}

function addDrop(inventory, dropMasiv) {
    //[{"chance": 100, "id": "sand", "meta": null,count": 1}]
    for (let i = 0; i < dropMasiv.length; i++) {
        let drop = dropMasiv[i]
        ramItem.addId(inventory, ramItemNew.itemData(drop.id), drop.count)
    }
}

// Функция для добавления всех предметов из инвентаря
function addItemToInventoryFromInventory(inventory, startInventoryFrom) {
    let inventoryFrom = jsonPS(startInventoryFrom)
    if (inventoryFrom) {
        for (let i = 0; i < inventoryFrom.length; i++) {
            if (inventoryFrom[i]) {
                addItemToInventory(inventory, inventoryFrom[i].itemData, inventoryFrom[i].count)
            }
        }
    }
}

function fillInNeiFromAtlas(blockAtlas) {
    const inventory = new Inventory([{type: "Cell_item_nei", count: 100}])
    let i = 0
    for (const blockName in blockAtlas) {
        inventory.cells[i].setSlot(1, blockName)
        i++
    }
    return inventory
}
