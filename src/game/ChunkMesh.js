import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"
import { ID_MANAGER } from "/src/main/manager-id.js"


export class ChunkMesh{
    constructor(chunk_coord) {
        this.chunk_coord = chunk_coord;
        const { 
            chunkWidthInPixels, 
            chunkHeightInPixels,
            hexWidthInPixels,
            hexHeightInPixels
        } = HEX_PROP_MANAGER;

        this.canvas0 = new OffscreenCanvas(chunkWidthInPixels, chunkHeightInPixels);
        this.canvas1 = new OffscreenCanvas(chunkWidthInPixels,chunkHeightInPixels);
        this.canvasShadow = new OffscreenCanvas(chunkWidthInPixels + hexWidthInPixels, chunkHeightInPixels + hexHeightInPixels);

        this.ctx0 = this.canvas0.getContext("2d");
        this.ctx1 = this.canvas1.getContext("2d");
        this.ctxShadow = this.canvasShadow.getContext("2d");

        this.ctx0.imageSmoothingEnabled = false;
        this.ctx1.imageSmoothingEnabled = false;
        this.ctxShadow.imageSmoothingEnabled = false;
    }
    async drawChunk(chunck_data) {
        if (!chunck_data) return
        const { ctx0, ctx1, ctxShadow } = this;
        const { 
            chunkWidthInPixels, 
            chunkHeightInPixels,
            chunkDepth,
            hexCoordsInChunk,
            hexWidthInPixels,
            hexHeightInPixels
        } = HEX_PROP_MANAGER;

        ctx0.clearRect(0, 0, chunkWidthInPixels, chunkHeightInPixels);
        ctx1.clearRect(0, 0, chunkWidthInPixels, chunkHeightInPixels);
        ctxShadow.clearRect(0, 0, chunkWidthInPixels + hexWidthInPixels, chunkHeightInPixels + hexHeightInPixels);

        const count = chunkDepth * chunkDepth;
        const doubleHexWidth = 2 * hexWidthInPixels;
        const doubleHexHeight = 2 * hexHeightInPixels;
        
        for (let i = 0; i < count; i++) {
            const dataIndex = 4 * i;
            const id0 = chunck_data[dataIndex];
            const id1 = chunck_data[dataIndex + 2];
            const { x, y } = hexCoordsInChunk[i];
            if (id1) {
                const texture1_name = RESOURCES_MANAGER.getBlock(ID_MANAGER.get_block_name(id1)).texture + "_1";
                this.drawHexTexture(ctx1, x, y, texture1_name, hexWidthInPixels, hexHeightInPixels);
                this.drawHexTexture(ctxShadow, x, y, "hex_shadow", doubleHexWidth, doubleHexHeight );
            } else if (id0){
                const texture0_name = RESOURCES_MANAGER.getBlock(ID_MANAGER.get_block_name(id0)).texture + "_0";
                this.drawHexTexture(ctx0, x, y, texture0_name, hexWidthInPixels, hexHeightInPixels);
            }
        }
    }
    drawHexTexture(ctx, coordX, coordY, imageName, width, height) {
        if (!imageName) return;
        ctx.drawImage(RESOURCES_MANAGER.getImage(imageName), coordX, coordY, width, height)
    }
    getChunkCoord(){
        return this.chunk_coord;
    }
}
