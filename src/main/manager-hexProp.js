class hexProp  {
    constructor() {
        this.chunkDepth = 16;
        
        this.hexHeightInPixels = 60;
        this.hexWidthInPixels = 54;

        this.hexRatio = this.hexWidthInPixels/this.hexHeightInPixels;

        this.chunkHeightInPixels = this.hexHeightInPixels * (this.chunkDepth * 3/4 + 0.5);
        this.chunkWidthInPixels = this.hexWidthInPixels * (this.chunkDepth + 0.5);
        this.hexCoordsInChunk = this.getHexCoordInChunk();

        this.framePoint = [
            [0, this.hexHeightInPixels/2],
            [this.hexWidthInPixels/2, this.hexHeightInPixels/4],
            [this.hexWidthInPixels/2, -this.hexHeightInPixels/4],
            [0, -this.hexHeightInPixels/2],
            [-this.hexWidthInPixels/2, -this.hexHeightInPixels/4],
            [-this.hexWidthInPixels/2, this.hexHeightInPixels/4]
        ];

        this.neighbors = {
            "0": [
                [-1, -1],
                [ 0, -1],
                [ 1,  0],
                [ 0,  1],
                [-1,  1],
                [-1,  0],
            ],
            "1": [
                [ 0, -1],
                [ 1, -1],
                [ 1,  0],
                [ 1,  1],
                [ 0,  1],
                [-1,  0],
            ]
        }
    }
    getHexCoordInChunk(){
        let array = [];
        for (let x = 0; x < this.chunkDepth; x++){
            for (let y = 0; y < this.chunkDepth; y++){
                let yCoord = y * 0.75 * this.hexHeightInPixels;
                let xCoord = x * this.hexWidthInPixels;
                if (y % 2 == 1) {
                    xCoord += this.hexWidthInPixels/2;
                }
                array.push({"x": xCoord, "y": yCoord});
            }
        }
        return array;
    }
}

export const HEX_PROP_MANAGER  = new hexProp ();