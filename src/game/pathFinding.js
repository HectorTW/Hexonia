import { HexCoord } from "/src/game/grid.js"
import { HEX_PROP_MANAGER } from "/src/main/manager-hexProp.js"

export class PathFinding{
    constructor (){
        this.cols = 48;
        this.rows = 48;
        this.grid = null; //array of all the grid points
    }
    setGrid(grid, topLeftCrnerCoord) {
        this.grid = grid;
        this.deltaX = topLeftCrnerCoord.x
        this.deltaY = topLeftCrnerCoord.y
        this.initGrid();
    }
    initGrid() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.grid[i][j]) this.grid[i][j].updateNeighbors(this.grid);
            }
        }
    }
    resetGrid(){
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.grid[i][j]) this.grid[i][j].reset(i, j);
            }
        }
    }
    search([startX, startY], [endX, endY]) {
        this.openSet = [];
        this.closedSet = [];

        this.path = [];

        if (!this.grid[startX]) return [];
        if (!this.grid[startX][startY]) return [];
        if (!this.grid[endX]) return [];
        if (!this.grid[endX][endY]) return [];

        this.start = this.grid[startX][startY];
        this.end = this.grid[endX][endY];

        this.openSet.push(this.start);
        while (this.openSet.length > 0) {
            //assumption lowest index is the first one to begin with
            let lowestIndex = 0;
            for (let i = 0; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            let current = this.openSet[lowestIndex];

            if (current === this.end) {
                let temp = current;
                this.path.push(temp);
                while (temp.parent) {
                    this.path.push(temp.parent);
                    temp = temp.parent;
                }
                console.log("DONE!");
                this.resetGrid();
                return this.path.reverse();
            }

            this.openSet.splice(lowestIndex, 1);
            this.closedSet.push(current);

            let neighbors = current.neighbors;

            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                if (!this.closedSet.includes(neighbor)) {
                    let possibleG = current.g + 1;

                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (possibleG >= neighbor.g) {
                        continue;
                    }

                    neighbor.g = possibleG;
                    neighbor.h = heuristic(neighbor, this.end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                }
            }
        }
        this.resetGrid();
        return [];
    }

}

function heuristic(position0, position1){
    // let x1 = position0.x - Math.floor(position0.y / 2);
    // let z1 = position0.y;
    // let y1 = -x1 - z1;

    // let x2 = position1.x - Math.floor(position1.y / 2);
    // let z2 = position1.y;
    // let y2 = -x2 - z2;

    // return (Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)) / 2;
    const global_coord0 = new HexCoord(position0.x, position0.y).toGlobal();
    const global_coord1 = new HexCoord(position1.x, position1.y).toGlobal();

    return Math.sqrt((global_coord1.x-global_coord0.x)**2 + (global_coord1.y-global_coord0.y)**2)
}
export class GridPoint {
    constructor(x, y) {
        this.x = x; //x location of the grid point
        this.y = y; //y location of the grid point
        this.f = 0; //total cost function
        this.g = 0; //cost function from start to the current grid point
        this.h = 0; //heuristic estimated cost function from current grid point to the goal
        this.neighbors = []; // neighbors of the current grid point
        this.parent = undefined; // immediate source of the current grid point
    } 
    reset (x, y){
        this.x = x; //x location of the grid point
        this.y = y; //y location of the grid point
        this.f = 0; //total cost function
        this.g = 0; //cost function from start to the current grid point
        this.h = 0; //heuristic estimated cost function from current grid point to the goal
        this.parent = undefined; // immediate source of the current grid point
    }
    updateNeighbors (grid) {
        let i = this.x;
        let j = this.y;
        const neighbors = HEX_PROP_MANAGER .neighbors[this.y % 2]
        for (let k = 0; k < neighbors.length; k++){
            const neighbor = neighbors[k];
            if (!grid[i + neighbor[0]]) continue 
            if (!grid[i + neighbor[0]][j + neighbor[1]]) continue 
            this.neighbors.push(grid[i + neighbor[0]][j + neighbor[1]]);
        }
    };
}