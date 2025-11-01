import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"
import { SETINGS_MANAGER } from "/src/main/manager-setings.js"

import { ACTIONS_MANAGER } from "/src/game/manager-actions.js"
import { WORKER_MANAGER } from "/src/game/manager-worker.js"
import { CAMERA_MANAGER } from "/src/game/manager-camera.js"
import { COORD_FACTORY } from "/src/game/grid.js"
import { ChunkMesh } from "/src/game/ChunkMesh.js"

export class drawerManager {
    constructor () {}
    initialize(){
        this.frames_per_second = 0;
        this.frames_per_second_count = 0;
        this.last_sekond_time = performance.now();

        this.minChunk = null;
        this.minChunkGlobal = null;

        this.chunkMeshs = {};
        this.receivedChunksList = {};
        this.entitys = [];

        this.canvas_game = document.createElement("canvas");
        this.canvas_selected = document.createElement("canvas");
        this.canvas_game.id = "canvas-game";
        this.canvas_selected.id = "canvas-selected";
        document.getElementById("app").appendChild(this.canvas_game);
        document.getElementById("app").appendChild(this.canvas_selected);

        this.canvas_offScreen = new OffscreenCanvas(window.innerWidth, window.innerHeight);
        this.canvas_offScreenShadow = new OffscreenCanvas(window.innerWidth, window.innerHeight);
        this.canvas_offScreenShadowTime = new OffscreenCanvas(window.innerWidth, window.innerHeight);
        
        this.ctx_game = this.canvas_game.getContext("2d");
        this.ctx_selected = this.canvas_selected.getContext("2d");
        this.ctx_offScreen = this.canvas_offScreen.getContext("2d");
        this.ctx_offScreenShadow = this.canvas_offScreenShadow.getContext("2d");
        this.ctx_offScreenShadowTime = this.canvas_offScreenShadowTime.getContext("2d");

        this.resizeAllCanvases();
        this.checkViewDistance();
    }
    clear(ctx, canvas){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    update(){
        const currentTime = performance.now();
        if (currentTime - this.last_sekond_time >= 1000) {
            this.frames_per_second = this.frames_per_second_count
            this.frames_per_second_count = 0;
            this.last_sekond_time = currentTime;
        }
    }
    draw(){
        this.frames_per_second_count++;

        // draw chunks from receivedChunksList
        for (const chunkName in this.receivedChunksList) {
            const chunkMesh = this.chunkMeshs[chunkName];
            if (!chunkMesh) continue
            chunkMesh.drawChunk(this.receivedChunksList[chunkName]);
        }
        this.receivedChunksList = {};

        // draw
        const ctxGame = this.ctx_game;
        const ctxSelected = this.ctx_selected;
        const ctxOffScreen = this.ctx_offScreen;
        const ctxOffScreenShadow = this.ctx_offScreenShadow;
        const ctxOffScreenShadowTime = this.ctx_offScreenShadowTime;

        this.clear(ctxGame, this.canvas_game);
        this.clear(ctxSelected, this.canvas_game);
        this.clear(ctxOffScreen, this.canvas_game);
        this.clear(ctxOffScreenShadow, this.canvas_game);
        this.clear(ctxOffScreenShadowTime, this.canvas_game);

        const minChunkX = this.minChunk.x;
        const minChunkY = this.minChunk.y;
        const cameraScale = CAMERA_MANAGER.scale;
        const leftCornerLocalCoord = COORD_FACTORY.create_chunk(minChunkX, minChunkY).toGlobal().toLocal();
        const x = leftCornerLocalCoord.x - cameraScale * HEX_PROP_MANAGER .hexRatio / 2;
        const y = leftCornerLocalCoord.y - cameraScale / 2;

        // 0 Layer
        const chunkMeshes = this.chunkMeshs;
        for (const name in chunkMeshes) {
            const mesh = chunkMeshes[name];
            const coord = mesh.chunk_coord;
            const xPos = x + (coord.x - minChunkX) * this.xMultiplier;
            const yPos = y + (coord.y - minChunkY) * this.yMultiplier;
            ctxOffScreen.drawImage(
                mesh.canvas0,
                xPos,
                yPos,
                this.chunkWidth,
                this.chunkHeight
            );
        }
        // Swadow Layer
        for (const name in chunkMeshes) {
            const mesh = chunkMeshes[name];
            const coord = mesh.chunk_coord;
            const xPos = x + (coord.x - minChunkX) * this.xMultiplier;
            const yPos = y + (coord.y - minChunkY) * this.yMultiplier;
            ctxOffScreenShadowTime.drawImage(
                mesh.canvasShadow,
                xPos,
                yPos,
                this.chunkWidthShadow,
                this.chunkHeightShadow
            );
        }
        ctxOffScreenShadow.drawImage(this.canvas_offScreenShadowTime, 0, 0, window.innerWidth, window.innerHeight);
        ctxOffScreen.drawImage(this.canvas_offScreenShadow, 0, 0, window.innerWidth, window.innerHeight);
        // 1 Layer
        for (const name in chunkMeshes) {
            const mesh = chunkMeshes[name];
            const coord = mesh.chunk_coord;
            
            const xPos = x + (coord.x - minChunkX) * this.xMultiplier;
            const yPos = y + (coord.y - minChunkY) * this.yMultiplier;
            
            ctxOffScreen.drawImage(
                mesh.canvas1,
                xPos,
                yPos,
                this.chunkWidth,
                this.chunkHeight
            );
        }
        // HERO
        for (let i = 0, len = this.entitys.length; i < len; i++) {
            const entity = this.entitys[i]
            const coord = entity.coord.toLocal()
            if (entity.type = "hero") {
                this.drawHexTexture (
                    ctxOffScreen,
                    coord.x,
                    coord.y,
                    "red_0",
                    3
                )
            }
        }

        ctxGame.drawImage(this.canvas_offScreen, 0, 0, window.innerWidth, window.innerHeight);

        //РАМКА
        const scaleRatio = cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        const framePoints = HEX_PROP_MANAGER .framePoint;
        const coord3 = ACTIONS_MANAGER.mouse_hex_coord.toGlobal().toLocal();
        ctxSelected.beginPath();

        for (let i = 0, len = framePoints.length; i < len; i++) {
            const point = framePoints[i];
            ctxSelected.lineTo(
                coord3.x + point[0] * scaleRatio,
                coord3.y + point[1] * scaleRatio
            );
        }

        ctxSelected.closePath();
        ctxSelected.stroke();

        
    }
    drawHexTexture (ctx, centerCoordX, centerCoordY, imageName, scale) {
        if (!imageName) return;
        const image = RESOURCES_MANAGER.getImage(imageName);
        if (!image) return;
        ctx.drawImage(
            image,
            centerCoordX - this.hexWidthInPixels * scale/2,
            centerCoordY - this.hexHeightInPixels * scale/2,
            this.hexWidthInPixels * scale,
            this.hexHeightInPixels * scale
        )
    }

    checkViewDistance(){
        // scaleConstant
        const cameraScale = CAMERA_MANAGER.scale;
        this.chunkWidth = HEX_PROP_MANAGER .chunkWidthInPixels * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        this.chunkHeight = HEX_PROP_MANAGER .chunkHeightInPixels * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        this.chunkWidthShadow = (HEX_PROP_MANAGER .chunkWidthInPixels + HEX_PROP_MANAGER .hexWidthInPixels) * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        this.chunkHeightShadow = (HEX_PROP_MANAGER .chunkHeightInPixels + HEX_PROP_MANAGER .hexHeightInPixels) * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        const chunkDepth = HEX_PROP_MANAGER .chunkDepth;
        this.xMultiplier = HEX_PROP_MANAGER .hexWidthInPixels * chunkDepth * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        this.yMultiplier = HEX_PROP_MANAGER .hexHeightInPixels * chunkDepth * 0.75 * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;

        this.hexWidthInPixels = HEX_PROP_MANAGER .hexWidthInPixels * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;
        this.hexHeightInPixels = HEX_PROP_MANAGER .hexHeightInPixels * cameraScale / HEX_PROP_MANAGER .hexHeightInPixels;

        const centerX = CAMERA_MANAGER.center_chunk_coord.x;
        const centerY = CAMERA_MANAGER.center_chunk_coord.y;
        // Add
        const addDist = SETINGS_MANAGER["render-distance"];
        const addMinX = centerX - addDist + 1;
        const addMaxX = centerX + addDist;
        const addMinY = centerY - addDist + 1;
        const addMaxY = centerY + addDist;
        for (let x = addMinX; x < addMaxX; x++) {
            for (let y = addMinY; y < addMaxY; y++) {
                const chunkCoordName = x + "," + y;
                if (!(chunkCoordName in this.chunkMeshs)) {
                    this.chunkMeshs[chunkCoordName] = new ChunkMesh(COORD_FACTORY.create_chunk(x, y), this);
                    WORKER_MANAGER.postMessage( 
                        "get_chunk_data",
                        {"chunk_coord_name": x + "," + y} 
                    )
                }
            }
        }

        // Remove
        const removeDist = SETINGS_MANAGER["render-distance"] + SETINGS_MANAGER["render-threshold"];
        const removeMinX = centerX - removeDist;
        const removeMaxX = centerX + removeDist;
        const removeMinY = centerY - removeDist;
        const removeMaxY = centerY + removeDist;
        for (const chunkCoordName in this.chunkMeshs) {
            const coord = this.chunkMeshs[chunkCoordName].getChunkCoord();
            if (
                coord.x < removeMinX ||
                coord.x > removeMaxX ||
                coord.y < removeMinY ||
                coord.y > removeMaxY
            ) {
                delete this.chunkMeshs[chunkCoordName];
            }
        }

        this.minChunk = COORD_FACTORY.create_chunk(removeMinX, removeMinY);
        this.minChunkGlobal = this.minChunk.toGlobal;
    }
    resizeAllCanvases(){
        this.canvas_game.width = window.innerWidth;
        this.canvas_game.height = window.innerHeight;
        this.canvas_selected.width = window.innerWidth;
        this.canvas_selected.height = window.innerHeight;
        this.canvas_offScreen.width = window.innerWidth;
        this.canvas_offScreen.height = window.innerHeight;
        this.canvas_offScreenShadow.width = window.innerWidth;
        this.canvas_offScreenShadow.height = window.innerHeight;
        this.canvas_offScreenShadowTime.width = window.innerWidth;
        this.canvas_offScreenShadowTime.height = window.innerHeight;
        
        this.ctx_game.imageSmoothingEnabled = false;
        this.ctx_selected.imageSmoothingEnabled = false;
        this.ctx_offScreen.imageSmoothingEnabled = false;
        this.ctx_offScreenShadow.imageSmoothingEnabled = false;
        this.ctx_offScreenShadowTime.imageSmoothingEnabled = false;

        this.ctx_offScreenShadow.globalAlpha = 0.6;
        this.ctx_selected.lineWidth = 5;
        this.ctx_selected.strokeStyle = "Black";
    }
}

export const DRAWER_MANAGER = new drawerManager();