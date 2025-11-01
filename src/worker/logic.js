import { INVENTORYS_MANAGER } from '/src/worker/manager-inventorys.js';
import { ID_MANAGER } from '/src/main/manager-id.js';

export function player_pkm_on_block (player_id, x, y) {
    if (self.engine.world.getBlockId(x, y, 1) !== 0) return
    self.engine.world.setBlock(x, y, 1, ID_MANAGER.get_block_id("colour:blue")); 
}

export function player_lkm_on_block (player_id, x, y) {
    self.engine.world.setBlock(x, y, 1, ID_MANAGER.get_block_id("base:aer"));
}

export function player_pkm_on_cell (player_id, inventory_id, cell_id) {
    const player_inventory = INVENTORYS_MANAGER.get_inventory(1)
    const target_inventory = INVENTORYS_MANAGER.get_inventory(inventory_id)
    const hand_cell = player_inventory.cells[40];
    target_inventory.cells[cell_id].rightMouseKeyClick(hand_cell);
    player_inventory.isChanges = true;
    target_inventory.isChanges = true;
}

export function player_lkm_on_cell (player_id, inventory_id, cell_id) {
    const player_inventory = INVENTORYS_MANAGER.get_inventory(1)
    const target_inventory = INVENTORYS_MANAGER.get_inventory(inventory_id)
    const hand_cell = player_inventory.cells[40];
    target_inventory.cells[cell_id].leftMouseKeyClick(hand_cell);
    player_inventory.isChanges = true;
    target_inventory.isChanges = true;
}