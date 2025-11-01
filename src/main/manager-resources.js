import { HudDebug } from "/res/user-interface/hud/HudDebug.js"
import { HudNotEnoughItems } from "/res/user-interface/hud/HudNotEnoughItems.js"
import { HudPlayerInventory } from "/res/user-interface/hud/HudPlayerInventory.js"
import { HudPlayerToolbar } from "/res/user-interface/hud/HudPlayerToolbar.js"

import { UiEscape } from "/res/user-interface/ui/UiEscape.js"
import { UiOptions } from "/res/user-interface/ui/UiOptions.js"
import { UiSinglePlayer } from "/res/user-interface/ui/UiSinglePlayer.js"
import { UiStart } from "/res/user-interface/ui/UiStart.js"

class Resources {
    constructor() {
        this.control_setings = {};
        this.image_container = {};
        this.block_container = {};
        this.item_container = {};

        this.hud_container = {
            HudDebug,
            HudNotEnoughItems,
            HudPlayerInventory,
            HudPlayerToolbar,
        };
        this.ui_container = {
            UiEscape,
            UiOptions,
            UiSinglePlayer,
            UiStart,
        };

        this.html_container = {};
    }

    async initialize(object) {
        console.log("%cResources :>> initialize", "background-color: green; font-weight: bold");
        console.group("%cResources :>> stat", "color: green");
        if (object.control_setings){
            this.control_setings = await this.loadFiles(
                await this.loadFile(
                    "res/registers/control_setings_registr.json",
                    "json"
                ),
                "json",
            );
            console.log("%cResources :>>", "color: green", Object.keys(this.control_setings).length, "control_setings load done" );
        }
        if (object.image){
            this.image_container = await this.load_Images(
                await this.loadFile(
                    "res/registers/texture_registr.json",
                    "json"
                )
            );
            console.log("%cResources :>>", "color: green", Object.keys(this.image_container).length, "image load done");
        }
        if (object.html){
            this.html_container = await this.loadFiles(
                await this.loadFile(
                    "res/registers/html_registr.json",
                    "json"
                ),
                "text",
            );
            console.log("%cResources :>>", "color: green", Object.keys(this.html_container).length, "html load done");
        }
        if (object.block){
            this.block_container = await this.loadFiles(
                await this.loadFile(
                    "res/registers/blocks_registr.json",
                    "json"
                ),
                "json",
            );
            for (const key in this.block_container) {
                const pack_name = this.block_container[key].pack
                this.block_container[pack_name + ":" + key] = this.block_container[key]
                delete this.block_container[key]
            }
            console.log("%cResources :>>", "color: green", Object.keys(this.block_container).length, "block_container load done");
        }
        if (object.item){
            this.item_container = await this.loadFiles(
                await this.loadFile(
                    "res/registers/items_registr.json",
                    "json"
                ),
                "json",
            );
            for (const key in this.item_container) {
                const pack_name = this.item_container[key].pack
                this.item_container[pack_name + ":" + key] = this.item_container[key]
                delete this.item_container[key]
            }
            console.log("%cResources :>>", "color: green", Object.keys(this.item_container).length, "item_container load done");
        }
        if (object.inventorys){
            this.inventorys_container = await this.loadFiles(
                await this.loadFile(
                    "res/registers/inventorys_registr.json",
                    "json"
                ),
                "json",
            );
            for (const key in this.inventorys_container) {
                const inventory_array = this.inventorys_container[key];
                const result = [];
                for (let cell_type_index = 0; cell_type_index < inventory_array.length; cell_type_index++) {
                    const cell_type_element = inventory_array[cell_type_index];
                    for (let index = 0; index < cell_type_element.count; index++) {
                        result.push(cell_type_element["type"]);
                    }
                }
                this.inventorys_container[key] = result;
            }
            console.log("%cResources :>>", "color: green", Object.keys(this.inventorys_container).length, "inventorys_container load done");


        }
        console.log('this :>> ', this);
        console.groupEnd();
    };

    async loadFile(filePath, type, key) {
        if (type === "script") {
            const module = await import("/" + filePath);
            return module[key];
        }
            
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети: ' + response.statusText);
                }
                if (type === "json") return response.json();
                if (type === "text") return response.text();
            })
            .then(data => {
                if (type === "json") return data;
                if (type === "text") return data;
            })
            .catch(error => {
                console.error('Произошла ошибка при загрузке:', type, error);
            });
    };

    async loadFiles(filePaths, type) {
        const loadedFiles = {};
        for (const key in filePaths) {
            loadedFiles[key] = await this.loadFile(filePaths[key], type, key);
        }
        return loadedFiles;
    }

    async load_Images(imagePaths) {
        const loadedImages = {};
        for (const key in imagePaths) {
            const image = new Image();
            image.src = imagePaths[key];
    
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
            });

            loadedImages[key] = image;
        }
        return loadedImages;
    }

    getBlock = (block_name) => this.block_container[block_name] || this.item_container[block_name];
    getInventory = (type_name) => this.inventorys_container[type_name];
    getHTML = (html_name) => this.html_container[html_name];
    getHUD = (hud_name) => this.hud_container[hud_name];
    getUI = (ui_name) => this.ui_container[ui_name];
    getImage(image_name) {
        if (this.image_container[image_name]) {
            return this.image_container[image_name];
        } else {
            return this.image_container[image_name + "_1"];
        }
    }
}

export const RESOURCES_MANAGER = new Resources();