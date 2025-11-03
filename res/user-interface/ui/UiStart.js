import { APPLICATION_MANAGER } from "/src/main/Application.js"
import { GAME_MANAGER } from "/src/game/manager-game.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

export class UiStart {
    constructor() {
        this.onClick = {
            "qick_start_button": async () => {
                const newWorldDevName = await APPLICATION_MANAGER.createNewWorld("New World");
                await GAME_MANAGER.start(newWorldDevName);
            },
            "single_player_menu_button": () => {
                UI_MANAGER.openUi("UiSinglePlayer");
            },
            "settings_menu_button": () => {
                UI_MANAGER.openUi("UiOptions");
            },
            "language_menu_button": () => {
                UI_MANAGER.openUi("menu_language");
            },
        },
        this.buttonsNavigator = {
            "none": [
                "qick_start_button",
                "qick_start_button",
                "qick_start_button",
                "qick_start_button"
            ],
            "qick_start_button": [
                "language_menu_button",
                "language_menu_button",
                "single_player_menu_button",
                "single_player_menu_button"
            ],
            "single_player_menu_button": [
                "qick_start_button",
                "qick_start_button",
                "settings_menu_button",
                "language_menu_button"
            ],
            "settings_menu_button": [
                "single_player_menu_button",
                "single_player_menu_button",
                "language_menu_button",
                "language_menu_button"
            ],
            "language_menu_button": [
                "single_player_menu_button",
                "settings_menu_button",
                "qick_start_button",
                "qick_start_button"
            ],
        }
    };
    onStart(){};
    onUpdate(){};
} 