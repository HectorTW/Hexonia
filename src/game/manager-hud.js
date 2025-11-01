import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { INPUT_MANAGER } from "/src/main/manager-input.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

import { WORKER_MANAGER } from "/src/game/manager-worker.js"

class HudManager {
    constructor() {
        this.isActive = false;
    }
    initialize(){
        this.isActive = true;
        this.isHudMenuOpen = false;
        this.slot_size = null;
        this.slot_gap = null;
        this.HUD_container = [];
        this.main_HUD_divs = {};

        this.resizeWindowSize();


        this.main_HUD_divs["hud"] = document.createElement("div");
        this.main_HUD_divs["hud_game"] = document.createElement("div");
        this.main_HUD_divs["hud_menu"] = document.createElement("div");

        document.getElementById("app").appendChild(this.main_HUD_divs["hud"]);
        this.main_HUD_divs["hud"].appendChild(this.main_HUD_divs["hud_game"]);
        this.main_HUD_divs["hud"].appendChild(this.main_HUD_divs["hud_menu"]);

        this.main_HUD_divs["hud"].id = "HUD";
        this.main_HUD_divs["hud_game"].id = "HUD-game";
        this.main_HUD_divs["hud_menu"].id = "HUD-menu";

        this.main_HUD_divs["hud"].style.visibility = "visible";
        this.main_HUD_divs["hud_game"].style.visibility = "visible";
        this.main_HUD_divs["hud_menu"].style.visibility = "hidden";

        this.addHud("hud_game", "HudDebug");
        this.addHud("hud_game", "HudPlayerToolbar", 1);
        this.addHud("hud_menu", "HudPlayerInventory", 1);
        this.addHud("hud_menu", "HudNotEnoughItems");
    }
    close(){
        this.main_HUD_divs = {};
        this.receivedInventorysData = null;

        this.isHudMenuOpen = null;
    }
    addHud(main_hud_name, hud_type_name, inventory_id = null) {
        const hud_id = this.HUD_container.length;
        const new_div = document.createElement("div");
        new_div.setAttribute("hud-id", hud_id);
        new_div.setAttribute("inventory-id", inventory_id);
        this.main_HUD_divs[main_hud_name].appendChild(new_div);

        const hud_class = RESOURCES_MANAGER.getHUD(hud_type_name)
        const HUD = new hud_class(hud_type_name, new_div, hud_id, inventory_id);
        this.HUD_container[hud_id] = HUD

        HUD.onStart();
        HUD.onDraw();

        this.update_inventorys_subscription();
    }
    removeHud(hud_id){
        this.HUD_container[hud_id] = null;
        this.update_inventorys_subscription();
    }
    update_inventorys_subscription(){
        const inventorys_subscription = [];
        const HUD_container = this.HUD_container
        for (let index = 0; index < HUD_container.length; index++) {
            const HUD = HUD_container[index];
            const inventory_id = HUD.inventory_id;
            if (inventory_id){
                if (!inventorys_subscription.includes(inventory_id)){
                    inventorys_subscription.push(inventory_id)
                }
            }
            WORKER_MANAGER.postMessage(
                "inventorys_subscription",
                {"array": inventorys_subscription}
            )
        }
    }
    draw(){}
    update(){
        if (!this.isActive) return
        if (INPUT_MANAGER.is_action_just_pressed("open-inventory")) {
            this.isHudMenuOpen ? this.closeHudMenu() : this.openHudMenu()
        }
        if (INPUT_MANAGER.is_action_just_pressed("escape")){
            if (this.isHudMenuOpen) {
                this.closeHudMenu();
            } else {
                window.app.game.active = false;
                UI_MANAGER.active = true;
                UI_MANAGER.openUi("menu_escape");
            }
        }

        const top_element = INPUT_MANAGER.topElement;
        if (top_element?.getAttribute("type") === "cell") {
            if (INPUT_MANAGER.is_action_just_pressed("break-block")) {
                const cell_id = parseInt(top_element.id.split("_")[1]);
                const inventory_id = parseInt(top_element.closest("div[inventory-id]").getAttribute("inventory-id"));
                
                WORKER_MANAGER.postMessage("lkm_on_cell", {
                    "cell_id": cell_id,
                    "inventory_id": inventory_id
                });
            }
            if (INPUT_MANAGER.is_action_just_pressed("place-block")) {
                const cell_id = parseInt(top_element.id.split("_")[1]);
                const inventory_id = parseInt(top_element.closest("div[inventory-id]").getAttribute("inventory-id"));
                
                WORKER_MANAGER.postMessage("pkm_on_cell", {
                    "cell_id": cell_id,
                    "inventory_id": inventory_id
                });
            }
        }

        const HUD_container = this.HUD_container;
        for (let index = 0; index < HUD_container.length; index++) {
            const HUD = HUD_container[index];
            HUD.onUpdate?.();
        }


    }
    openHudMenu(){
        if (this.isHudMenuOpen) return false
        this.isHudMenuOpen = true;
        this.main_HUD_divs["hud_menu"].style.visibility  = "visible";
    }
    closeHudMenu(){
        if (!this.isHudMenuOpen) return false
        this.isHudMenuOpen = false;
        this.main_HUD_divs["hud_menu"].style.visibility  = "hidden";
    }

    resizeWindowSize(){
        this.slot_size = Math.min(Math.floor(Math.min(window.innerHeight, window.innerWidth) / 250) * 15, 50);
        this.slot_gap = Math.min(Math.floor(Math.min(window.innerHeight, window.innerWidth) / 250) * 15, 3);
        document.documentElement.style.setProperty("--slot-size", this.slot_size + "px");
        document.documentElement.style.setProperty("--slot-gap", this.slot_gap + "px");

        const HUD_container = this.HUD_container;
        for (let index = 0; index < HUD_container.length; index++) {
            const HUD = HUD_container[index];
            HUD.onResize?.();
        }
    }
}

export const HUD_MANAGER = new HudManager();