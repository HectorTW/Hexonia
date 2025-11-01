"use strict";
import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"
import { UI_MANAGER } from "/src/main/manager-ui.js"
import { APP_DB_MANAGER } from "/src/main/manager-appDB.js"
import { INPUT_MANAGER } from "/src/main/manager-input.js"
import { ID_MANAGER } from "/src/main/manager-id.js"

import { DRAWER_MANAGER } from "/src/game/manager-drawer.js"
import { CAMERA_MANAGER } from "/src/game/manager-camera.js"
import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { HUD_MANAGER } from "/src/game/manager-hud.js"

import { Application } from "/src/main/Application.js"

window.app = new Application()
window.app.initialize()

// window.get = (manager_name) => {
//     switch (manager_name) {
// 		case "RESOURCES_MANAGER":
// 			return RESOURCES_MANAGER
// 		case "HEX_PROP_MANAGER":
// 			return HEX_PROP_MANAGER
// 		case "DRAWER_MANAGER":
// 			return DRAWER_MANAGER
// 		case "CAMERA_MANAGER":
// 			return CAMERA_MANAGER
// 		case "UI_MANAGER":
// 			return UI_MANAGER
// 		case "APP_DB_MANAGER":
// 			return APP_DB_MANAGER
// 		case "WORKER_MANAGER":
// 			return WORKER_MANAGER
// 		case "INPUT_MANAGER":
// 			return INPUT_MANAGER
// 		case "HUD_MANAGER":
// 			return HUD_MANAGER
// 		case "ID_MANAGER":
// 			return ID_MANAGER
// 		default:
// 			break;
// 	}
// }

// window.getCamera = () => window.app.game.camera;

class InvSlot extends HTMLElement {
    constructor() {
        super();
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.font = "26px minecraft";
        ctx.fillStyle = "White";
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];
            canvas.setAttribute(attr.name, attr.value);
            this.removeAttribute(attr.name);
        }
        canvas.setAttribute("type", "cell")
        this.appendChild(canvas);
    }
}

class InvSlotInvisible extends HTMLElement {
    constructor() {
        super();
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.font = "26px minecraft";
        ctx.fillStyle = "White";
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];
            canvas.setAttribute(attr.name, attr.value);
            this.removeAttribute(attr.name);
        }
        this.appendChild(canvas);
    }
}

class InvSlotTransparent extends HTMLElement {
    constructor() {
        super();
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.font = "26px minecraft";
        ctx.fillStyle = "White";
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];
            canvas.setAttribute(attr.name, attr.value);
            this.removeAttribute(attr.name);
        }
        this.appendChild(canvas);
    }
}
customElements.define('inv-slot', InvSlot);
customElements.define('inv-slot-invisible', InvSlotInvisible);
customElements.define('inv-slot-transparent', InvSlotTransparent);


/**
 * Полностью очищает IndexedDB для текущего сайта
 * @returns {Promise<void>} Промис, который разрешается после завершения очистки
 */
async function clearIndexedDBSimple() {
    try {
        const databases = await window.indexedDB.databases();
        await Promise.all(
            databases.map(db => 
                new Promise((resolve, reject) => {
                  const request = indexedDB.deleteDatabase(db.name);
                  request.onsuccess = resolve;
                  request.onerror = reject;
                })
            )
        );
        console.log('Все базы данных IndexedDB удалены');
    } catch (error) {
        console.error('Ошибка при удалении баз данных:', error);
        throw error;
    }
}
// clearIndexedDBSimple()
//   .then(() => console.log('Очистка завершена'))
//   .catch(error => console.error('Произошла ошибка:', error));