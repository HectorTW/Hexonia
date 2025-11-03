import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { ID_MANAGER } from "/src/main/manager-id.js"

import { HUD_MANAGER } from "/src/game/manager-hud.js"

export class Hud {
    constructor(hud_type_name, hud_div, hud_id, inventory_id) {
        this.hud_type_name = hud_type_name;
        this.hud_div = hud_div;
        this.hud_id = hud_id;
        this.inventory_id = inventory_id;

        this.hud_div.innerHTML = RESOURCES_MANAGER.getHTML(hud_type_name);
    }
    onStart(){};
    onDraw(){}
    onUpdate(){};
    remove(){
        this.hud_div.remove();
        HUD_MANAGER.removeHud(this.hud_id);
    };
    drawItems(){
        let cell_index = -1;
        const count_of_div_cells = this.hud_div.querySelectorAll("inv-container inv-slot").length;

        while ((cell_index < count_of_div_cells) && (cell_index < this.inventory_data.cells.length)) {
            cell_index++;
            const slot = this.inventory_data.cells[cell_index];

            const canvas = this.hud_div.querySelector("inv-container #cell_" + cell_index);
            if (!canvas) continue;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const slot_count = slot.count;
            if (!slot_count) continue;
            const item_id = slot.id;
            if (!item_id) continue;

            const item_meta = slot.meta;
            ctx.imageSmoothingEnabled = false;

            const item_name = ID_MANAGER.get_item_name(item_id);
            const block = RESOURCES_MANAGER.getBlock(item_name);
            const image_name = block.texture;
            const image = RESOURCES_MANAGER.getImage(image_name);
            const item_type = block.type;

            if (item_type == "block") {
                ctx.drawImage(
                    image,
                    6,
                    2,
                    54,
                    60
                )
                ctx.textAlign = "right"
                ctx.textBaseline = "bottom"
                ctx.fillText(slot_count, 64, 64);
            } else if (item_type == "instrument") {
                ctx.drawImage(getImage(textureName), size / 8, size / 8, (6 * size) / 8, (6 * size) / 8)
                ctx.fillStyle = "black"
                ctx.fillRect((1 * size) / 10, (8 * size) / 10, (8 * size) / 10, (1 * size) / 10)
                ctx.fillStyle = "green"
                ctx.fillRect(
                    (1 * size) / 10,
                    (8 * size) / 10,
                    ((8 * size) / 10 / ATLAS_ITEMS[this.slot.id].baseDurability) * this.slot.meta.durability,
                    (1 * size) / 10
                )
            } else if (item_type == "item") {
                ctx.drawImage(getImage(textureName), size / 8, size / 8, (6 * size) / 8, (6 * size) / 8)
                ctx.font = "40px Impact"
                ctx.fillStyle = "Black"
                ctx.textAlign = "right"
                ctx.textBaseline = "bottom"
                ctx.fillText(this.slot.count, (19 * size) / 20, (19 * size) / 20)
            }
        }
    }
    setData(inventory_data){
        this.inventory_data = inventory_data;
        this.drawItems();
    }
}