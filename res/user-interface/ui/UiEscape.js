import { APPLICATION_MANAGER } from "/src/main/Application.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

export class UiEscape {
    constructor() {
        this.onClick = {
            "back_to_game_button": () => {
                APPLICATION_MANAGER.game.active = true;
                UI_MANAGER.active = false;
                UI_MANAGER.closeUi();
            },
            "achievements_menu_button": () => {
                console.log('Ещё не готово :>> ');
            },
            "statistics_menu_button": () => {
                console.log('Ещё не готово :>> ');
            },
            "options_menu_button": () => {
            },
            "open_to_lan_button": () => {
                console.log('Ещё не готово :>> ');
            },
            "save_and_quit_button": async () => {
                await APPLICATION_MANAGER.saveAndQuit()
            },
        },
        this.buttonsNavigator = {
            "none": [
                "back_to_game_button",
                "back_to_game_button",
                "back_to_game_button",
                "back_to_game_button"
            ],
            "back_to_game_button": [
                "save_and_quit_button",
                "save_and_quit_button",
                "achievements_menu_button",
                "achievements_menu_button"
            ],
            "achievements_menu_button": [
                "back_to_game_button",
                "statistics_menu_button",
                "options_menu_button",
                "statistics_menu_button"
            ],
            "statistics_menu_button": [
                "back_to_game_button",
                "achievements_menu_button",
                "open_to_lan_button",
                "achievements_menu_button"
            ],
            "options_menu_button": [
                "achievements_menu_button",
                "open_to_lan_button",
                "save_and_quit_button",
                "open_to_lan_button"
            ],
            "open_to_lan_button": [
                "statistics_menu_button",
                "options_menu_button",
                "save_and_quit_button",
                "options_menu_button"
            ],
            "save_and_quit_button": [
                "options_menu_button",
                "options_menu_button",
                "back_to_game_button",
                "back_to_game_button"
            ],
        }
    }
    onStart(){}
    onUpdate(){}
} 