import { GlobalCoord, HexCoord, ChunkCoord } from "/src/game/grid.js"
import { StateMachine } from "/src/staf/stateMachine.js"

// Пример использования
export class Hero {
    constructor(hex_coord) {
        this.isMoving = false;
        this.isRotating = false;

        this.hex_coord = hex_coord;
        this.global_coord = hex_coord.toGlobal();
        this.camera_center_chunk_coord = new ChunkCoord(0,0);

        this.target_hex_coord = null;
        this.target_long_hex_coord = null;

        this.stateMachine = new StateMachine('idle');
        
        this.stateMachine.addState('idle', {
            enter: () => {
                this.hex_coord = this.global_coord.toHex();
                this.global_coord = this.hex_coord.toGlobal();
            },
            update: () => {
            },
            exit: () => {
            }
        });
        this.stateMachine.addState('move', {
            enter: () => {
                const path = this.pathFinding.search(
                    [
                        this.hex_coord.x - this.pathFinding.deltaX,
                        this.hex_coord.y - this.pathFinding.deltaY
                    ],
                    [
                        this.target_long_hex_coord.x - this.pathFinding.deltaX,
                        this.target_long_hex_coord.y - this.pathFinding.deltaY
                    ]
                );
                const next_coord = path[1];
                if (!next_coord) return this.isMoving = false;
                this.target_hex_coord = new HexCoord(next_coord.x + this.pathFinding.deltaX, next_coord.y + this.pathFinding.deltaY);
            },
            update: () => {
                if (!this.target_hex_coord) return this.isMoving = false;
                const target_global_coord = this.target_hex_coord.toGlobal();
                this.global_coord = new GlobalCoord(
                    this.global_coord.x + (target_global_coord.x - this.hex_coord.toGlobal().x)/20,
                    this.global_coord.y + (target_global_coord.y - this.hex_coord.toGlobal().y)/20
                )
                if (this.global_coord.equal(target_global_coord)){
                    this.hex_coord = this.global_coord.toHex();
                    this.global_coord = this.hex_coord.toGlobal();
                    if (this.hex_coord.equal(this.target_long_hex_coord)) return this.isMoving = false;
                    const path = this.pathFinding.search(
                        [
                            this.hex_coord.x - this.pathFinding.deltaX,
                            this.hex_coord.y - this.pathFinding.deltaY],
                            [this.target_long_hex_coord.x - this.pathFinding.deltaX,
                                this.target_long_hex_coord.y - this.pathFinding.deltaY
                            ]
                        );
                    const next_coord = path[1];
                    if (!next_coord) return this.isMoving = false;
                    this.target_hex_coord = new HexCoord(next_coord.x + this.pathFinding.deltaX, next_coord.y + this.pathFinding.deltaY);
                }
            },
            exit: () => {
                this.target_hex_coord = null;
                this.target_long_hex_coord = null;
                console.log('Перестал идти');
            }
        });
        this.stateMachine.addState('rotate', {
            enter: () => {
                console.log('Прыгаем');
                this.jumpStartTime = Date.now();
            },
            update: () => {
                const jumpDuration = Date.now() - this.jumpStartTime;
                if (jumpDuration > 1000) {
                    this.isJumping = false;
                }
                this.jumpAnimation();
            }
        });
        
        //// Определяем переходы
        this.stateMachine.addTransition('idle', 'move', () => this.isMoving);
        this.stateMachine.addTransition('move', 'idle', () => !this.isMoving);
        this.stateMachine.addTransition('idle', 'rotate', () => this.isRotating);
        this.stateMachine.addTransition('move', 'rotate', () => this.isRotating);
        this.stateMachine.addTransition('rotate', 'idle', () => !this.isRotating && !this.isMoving);
        this.stateMachine.addTransition('rotate', 'move', () => !this.isRotating && this.isMoving);
    }

    getHeroChunkCoord(){
        return this.hex_coord.toChunk();
    }
    getCameraChunkCoord(){
        return this.camera_center_chunk_coord;
    }
    update50ps() {
        this.stateMachine.update();
    }
    setLongTarget(hex_coord){
        if (this.hex_coord.equal(hex_coord)) return
        this.target_long_hex_coord = hex_coord;
        this.isMoving = true;
    }
}
