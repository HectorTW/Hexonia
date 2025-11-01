import { Cell } from "/src/item/Cell.js"

export class Cell_item extends Cell {
    objectsEqual(obj1, obj2) {
        // Сравниваем количество свойств
        if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
            return true
        } else {
            return false
        }
    }
}
