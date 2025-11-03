import { GAME_MANAGER } from "/src/game/manager-game.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"

import { SaveDataBase } from "/src/worker/manager-saveDB.js"

export class UiSinglePlayer {
    constructor() {
        this.onClick = {
            "item": async (worldDevName) => {
                const elements = document.querySelectorAll('#menu_single_player .item');
                for (const element of elements) {
                    element.className = "item";
                }
                document.querySelector(`#menu_single_player #item[arg="${worldDevName}"]`).classList.add("selected");
                UI_MANAGER.activeMenuObject.selected_world_name_dev = worldDevName;
            },
            "play_selected_world_button": async () => {
                await GAME_MANAGER.start(UI_MANAGER.activeMenuObject.selected_world_name_dev);
            },
            "create_new_world_menu_button": () => {
                UI_MANAGER.openUi("menu_create_new_world");
                document.querySelector("#menu_create_new_world #world_name").innerHTML = 
                `<input id="world_name_input" type="text" style="width: calc(min(45.0vh, 45.0vw));" autocomplete="off" value="${"New World"}">`
                const input = document.getElementById('world_name_input')
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            },
            "rename_button": () => {
                console.log('Ещё не готово :>> ');
            },
            "delete_button": () => {
                window.app.deleteWorld(UI_MANAGER.activeMenuObject.selected_world_name_dev);
                UI_MANAGER.openUi("menu_single_player");
            },
            "delete_all_button": async () => {
                await window.app.deleteAllWorlds();
                UI_MANAGER.openUi("menu_single_player");
            },
            "cancel_button": () => {
                UI_MANAGER.openUi("menu_start");
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
    async onStart(){
        let string = "";
        const worldsList = (await indexedDB.databases())
            .filter(obj => obj.name.startsWith("save:"))
            .map(obj => obj.name);
        
        const info = await Promise.all(
            worldsList.map(async (dev_world_name) =>  {
                const DB = new SaveDataBase(dev_world_name);
                await DB.initDB();
                return {
                    "dev-world-name": dev_world_name.slice(5),
                    "preview": await DB.getItem("info", "preview"),
                    "creation-date": await DB.getItem("info", "creation-date"),
                    "user-world-name": await DB.getItem("info", "user-world-name"),
                    "last-played-date": await DB.getItem("info", "last-played-date"),
                }
            })
        );

        info.sort((a, b) => {
            const dateA = new Date(a["last-played-date"]);
            const dateB = new Date(b["last-played-date"]);
            return dateB - dateA;
        });
        for (let i = 0; i < info.length; i++) {
            const worldInfoData = info[i];
            const creation_day = worldInfoData["creation-date"].toLocaleString('ru-RU', { day: '2-digit' });
            const creation_month = worldInfoData["creation-date"].toLocaleString('ru-RU', { month: '2-digit' });
            const creation_year = worldInfoData["creation-date"].toLocaleString('ru-RU', { year: '2-digit' });
            const creation_time = worldInfoData["creation-date"].toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });

            const last_played_day = worldInfoData["last-played-date"].toLocaleString('ru-RU', { day: '2-digit' });
            const last_played_month = worldInfoData["last-played-date"].toLocaleString('ru-RU', { month: '2-digit' });
            const last_played_year = worldInfoData["last-played-date"].toLocaleString('ru-RU', { year: '2-digit' });
            const last_played_time = worldInfoData["last-played-date"].toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            string +=`
            <div class="item" id="item" arg="${worldInfoData["dev-world-name"]}">
                <div class="flex-raw">
                    <canvas id="${worldInfoData["dev-world-name"]}_canvas"></canvas>
                    <div>
                        <div>
                            Name: ${worldInfoData["user-world-name"]}
                        </div>
                        <div>
                            Save: ${worldInfoData["dev-world-name"]}
                        </div>
                        <div>
                            ${last_played_day}.${last_played_month}.${last_played_year} ${last_played_time}/${creation_day}.${creation_month}.${creation_year} ${creation_time}
                        </div>
                        <div>
                            Survival Mode
                        </div>
                    </div>
                </div>
            </div>`
        }
        document.querySelector("#menu_single_player #list").innerHTML = string;
        for (let i = 0; i < info.length; i++) {
            const worldInfoData = info[i];
            if (!worldInfoData.preview) continue
            const targetCanvas = document.getElementById(`${worldInfoData["dev-world-name"]}_canvas`);
            const img = new Image();
            img.onload = () => {
                targetCanvas.width = 500;
                targetCanvas.height = 250;
                const ctx = targetCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 500, 500);
            };
            img.src = worldInfoData.preview;
        }
    };
} 