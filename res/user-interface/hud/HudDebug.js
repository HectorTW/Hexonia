import { ACTIONS_MANAGER } from "/src/game/manager-actions.js"
import { COORD_FACTORY } from "/src/game/grid.js"
import { Hud } from "/src/game/Hud.js"

export class HudDebug extends Hud {
    onUpdate(){
        const hex_coord_x = ACTIONS_MANAGER.mouse_hex_coord?.x;
        const hex_coord_y = ACTIONS_MANAGER.mouse_hex_coord?.y;
        const global_coord_x = ACTIONS_MANAGER.mouse_global_coord?.x;
        const global_coord_y = ACTIONS_MANAGER.mouse_global_coord?.y;
        const distance = ACTIONS_MANAGER.mouse_hex_coord?.getDistanceFromHex(COORD_FACTORY.create_hex(0,0));

        document.querySelector("#debug #info").innerHTML = `
        FPS : ${window.app.info.fps}<br>
        TPS : ${Math.round(1000/window.app.appTick.tps)}<br>
        Mouse: <br>
        >>  HexCoord : ${hex_coord_x}, ${hex_coord_y}<br>
        >>  GlobalCoord : ${Math.round(global_coord_x*100)/100}, ${Math.round(global_coord_y*100)/100}<br>
        >>  Distance : ${distance}<br>`
    }
}
