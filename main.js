import { APPLICATION_MANAGER } from "/src/main/Application.js"
import { createInvSlotClass } from "/src/game/item/inv-slot.js"

customElements.define('inv-slot', createInvSlotClass());
customElements.define('inv-slot-invisible', createInvSlotClass());
customElements.define('inv-slot-transparent', createInvSlotClass());

APPLICATION_MANAGER.initialize();