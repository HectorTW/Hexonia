import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { INPUT_MANAGER } from "/src/main/manager-input.js"

class UiManager {
    constructor() {
        this.UI_div = null;
        this.UI_obj = null;
        this.isActive = null;

        this.activeButtonId = null;
        this.activeButtonAtr = null;
    }
    initialize(){
        console.log("%cAppUiManager :>> initialize", "background-color: green; font-weight: bold");
        
        this.UI_div = document.createElement("div");
        document.getElementById("app").appendChild(this.UI_div);
        this.UI_div.id = "HUD-app";
        this.UI_div.style.zIndex = 10;

        this.openUi("UiStart");
    }
    async openUi(ui_type_name){
        this.isActive = true;
        const ui_class = RESOURCES_MANAGER.getUI(ui_type_name);
        this.UI_div.innerHTML = RESOURCES_MANAGER.getHTML(ui_type_name);
        this.UI_obj = new ui_class();
        await this.UI_obj.onStart();
    }
    closeUi(){
        this.isActive = false;
        this.UI_div.innerHTML = "";
        this.UI_obj = null;
    }
    async update(){
        if (!this.isActive) return

        if (window.app.game && window.app.game.isActive) {
            if (INPUT_MANAGER.is_action_just_pressed("escape")){
                INPUT_MANAGER.reset_action_just_pressed("escape")
                this.openUi("UiEscape");
            }
            return
        }
        if (INPUT_MANAGER.is_action_just_pressed("escape")){
            INPUT_MANAGER.reset_action_just_pressed("escape")
            const button_function = this.UI_obj.onClick["cancel_button"];
            if (button_function) await button_function();
        }
        if (INPUT_MANAGER.is_action_just_pressed("break-block") || INPUT_MANAGER.is_action_just_pressed("enter-key")){
            INPUT_MANAGER.reset_action_pressed("enter-key");
            INPUT_MANAGER.reset_action_pressed("break-block");
            INPUT_MANAGER.reset_action_just_pressed("enter-key");
            INPUT_MANAGER.reset_action_just_pressed("break-block");
            const button_function = this.UI_obj.onClick[this.activeButtonId];
            if (button_function) await button_function(this.activeButtonAtr);
        }
        if (INPUT_MANAGER.is_mouse_move()) {
            if (INPUT_MANAGER.topElement.classList.contains("button")){
                this.activeButtonId = INPUT_MANAGER.topElement.id;
                this.activeButtonAtr = INPUT_MANAGER.topElement.getAttribute("arg");
                this.UI_div.querySelectorAll(".button").forEach(btn => {
                    btn.classList.remove("hover-effect");
                });
            } else {
                this.activeButtonId = null;
                this.activeButtonAtr = null;
            }
            return
        }
        if (INPUT_MANAGER.is_action_just_pressed("camera-move-up")) this.navigation(0);
        if (INPUT_MANAGER.is_action_just_pressed("camera-move-left")) this.navigation(1);
        if (INPUT_MANAGER.is_action_just_pressed("camera-move-down")) this.navigation(2);
        if (INPUT_MANAGER.is_action_just_pressed("camera-move-right")) this.navigation(3);
    }
    navigation(direction_index) {
        const new_name = this.UI_obj.buttonsNavigator[this.activeButtonId];
        this.activeButtonId = new_name 
            ? new_name[direction_index] 
            : this.UI_obj.buttonsNavigator["none"][direction_index];
        this.UI_div.querySelectorAll(".button").forEach(btn => {
            btn.classList.remove("hover-effect");
        });
        this.UI_div.querySelector("#" + this.activeButtonId).classList.add("hover-effect");
    }
}

export const UI_MANAGER = new UiManager()

