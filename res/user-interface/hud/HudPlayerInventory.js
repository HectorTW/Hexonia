import { INPUT_MANAGER } from "/src/main/manager-input.js"

import { HUD_MANAGER } from "/src/game/manager-hud.js"
import { Hud } from "/src/game/Hud.js"

export class HudPlayerInventory extends Hud {
    onStart(){
        const item = this.hud_div.querySelector("#player_inventory_name");
        if (item) item.innerHTML = ` Inventory`;

        this.hud_div.querySelector("#close").addEventListener("onclick", () => {
            console.log('Hello :>> ');
            this.remove();
        })
    };
    onUpdate(){
        super.onUpdate();
        // close button
        const top_element = INPUT_MANAGER.topElement;
        if (top_element?.getAttribute("type") === "button") {
            if (INPUT_MANAGER.is_action_just_pressed("break-block")) {
                if (top_element.id == "close") this.remove();
            }
        }

        
        const info = this.hud_div.querySelector("#under_mouse_info");
        const info_text = this.hud_div.querySelector("#under_mouse_info_text");

        const mouse_local_coord = INPUT_MANAGER.get_mouse_local_coord();
        const window_size = INPUT_MANAGER.get_window_size();

        info.style.left = Math.min(mouse_local_coord.x - 32, window_size.width - 20 - info_text.offsetWidth) + "px"
        info.style.top = Math.min(mouse_local_coord.y - 32, window_size.height - 10 - info_text.offsetHeight) + "px"

        const isInHand = this.inventory_data.cells[40].slot?.id;
        const topElement = INPUT_MANAGER.topElement;
        if (topElement?.getAttribute("type") !== "cell") return
        const target_hud_id = parseInt(topElement.closest("div[hud-id]")?.getAttribute("hud-id"));
        const target_hud = HUD_MANAGER.HUD_container[target_hud_id];
        const target_hud_inventory_data = target_hud.inventory_data;
        const target_cell_id = parseInt(topElement.id.split("_")[1]);
        const target_cell = target_hud_inventory_data.cells[target_cell_id];

        if (isInHand || !target_cell.slot?.id) {
            info_text.style.display = "none"
            info_text.innerHTML = ""
        }
        //  else {
        //     info_text.style.display = "block"
        //     info_text.innerHTML = `
        //     ${translate(player.mouse.targetCell.slot.id)}<br>`
        //     if (player.mouse.targetCell.slot.meta) {
        //         info_text.innerHTML += `<br>
        //         ${JSON.stringify(player.mouse.targetCell.slot.meta)}<br>`
        //         if (player.mouse.targetCell.slot.meta.hasOwnProperty("durability")) {
        //             info_text.innerHTML += `
        //             ${translate("Durability")}:  ${player.mouse.targetCell.slot.meta.durability} / ${getBaseDurability(player.mouse.targetCell.slot.id)}<br>`
        //         }
        //     }
        // }
    };
} 