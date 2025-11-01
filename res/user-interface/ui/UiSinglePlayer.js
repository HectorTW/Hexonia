export class UiSinglePlayer {
    constructor() {
        this.onClick = {
            "item": async (worldDevName) => {
                const elements = document.querySelectorAll('#menu_single_player .item');
                for (const element of elements) {
                    element.className = "item";
                }
                document.querySelector(`#menu_single_player #item[arg="${worldDevName}"]`).classList.add("selected");
                window.get("UI_MANAGER").activeMenuObject.selected_world_name_dev = worldDevName;
            },
            "play_selected_world_button": async () => {
                await window.app.startGame(window.get("UI_MANAGER").activeMenuObject.selected_world_name_dev);
            },
            "create_new_world_menu_button": () => {
                window.get("UI_MANAGER").openUi("menu_create_new_world");
                document.querySelector("#menu_create_new_world #world_name").innerHTML = `
                <input id="world_name_input" type="text" style="width: calc(min(45.0vh, 45.0vw));" autocomplete="off" value="${"New World"}">`
                const input = document.getElementById('world_name_input')
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            },
            "rename_button": () => {
                console.log('Ещё не готово :>> ');
            },
            "delete_button": () => {
                window.app.deleteWorld(window.get("UI_MANAGER").activeMenuObject.selected_world_name_dev);
                window.get("UI_MANAGER").openUi("menu_single_player");
            },
            "delete_all_button": async () => {
                await window.app.deleteAllWorlds();
                window.get("UI_MANAGER").openUi("menu_single_player");
            },
            "cancel_button": () => {
                window.get("UI_MANAGER").openUi("menu_start");
            },
        },
        this.buttonsNavigator = {
            "none": [
                "play_selected_world_button",
                "play_selected_world_button",
                "play_selected_world_button",
                "play_selected_world_button"
            ],
            "play_selected_world_button": [
                "cancel_button",
                "create_new_world_menu_button",
                "rename_button",
                "create_new_world_menu_button"
            ],
            "create_new_world_menu_button": [
                "cancel_button",
                "play_selected_world_button",
                "delete_all_button",
                "play_selected_world_button"
            ],
            "rename_button": [
                "play_selected_world_button",
                "cancel_button",
                "delete_button",
                "delete_button"
            ],
            "delete_button": [
                "play_selected_world_button",
                "rename_button",
                "create_new_world_menu_button",
                "delete_all_button"
            ],
            "delete_all_button": [
                "create_new_world_menu_button",
                "delete_button",
                "cancel_button",
                "cancel_button"
            ],
            "cancel_button": [
                "create_new_world_menu_button",
                "delete_all_button",
                "play_selected_world_button",
                "rename_button"
            ],
        }
    }
} 