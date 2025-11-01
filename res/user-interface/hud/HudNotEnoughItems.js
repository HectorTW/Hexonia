import { INPUT_MANAGER } from "/src/main/manager-input.js"

import { HUD_MANAGER } from "/src/game/manager-hud.js"
import { Hud } from "/src/game/Hud.js"

export class HudNotEnoughItems extends Hud {
    onStart () {
        this.isOpen = true;
        this.fillNEI();
    };
    onDraw () {}
    onUpdate () {
        if (HUD_MANAGER.isHudMenuOpen && INPUT_MANAGER.is_action_just_pressed("open-nei")) {
            if (this.isOpen) {
                this.isOpen = false;
                this.hud_div.style.visibility = "hidden";
            } else {
                this.isOpen = true;
                this.hud_div.style.visibility = "visible";
            }
        }
    }
    onResize () {
        this.fillNEI();
    }
    fillNEI(){
        const htmlItem = this.hud_div.querySelector("#slots");
        htmlItem.innerHTML = "";

        const hotBarBackground = HUD_MANAGER.HUD_container[1].hud_div.querySelector("inv-background");
        const hotBarWidth = hotBarBackground.clientWidth + 5;
        const windowWidth = INPUT_MANAGER.get_window_size().width;

        this.hud_div.querySelector("#width").style.width = `${(windowWidth - hotBarWidth) / 2}px`;
        
        const cellHeight = Math.max((htmlItem.clientHeight - 20) / (HUD_MANAGER.slot_size + HUD_MANAGER.slot_gap) - 1, 1);
        const cellWidth = Math.max((htmlItem.clientWidth - 20) / (HUD_MANAGER.slot_size + HUD_MANAGER.slot_gap) - 1, 1);

        let htmlString = "<inv-col>";
        let cellIndex = 0;

        for (let row = 0; row < cellHeight; row++) {
            htmlString += "<inv-row>";
            
            for (let col = 0; col < cellWidth; col++) {
                htmlString += `<inv-slot-invisible id="nei_cell_${cellIndex}"></inv-slot-invisible>`;
                cellIndex++;
            }
            
            htmlString += "</inv-row>";
        }

        htmlString += "</inv-col>";
        htmlItem.innerHTML = htmlString;
    }
} 