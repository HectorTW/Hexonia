import { createInvSlotClass } from "/src/staf/inv-slot.js"
import { APPLICATION_MANAGER } from "/src/main/Application.js"

APPLICATION_MANAGER.initialize()

customElements.define('inv-slot', createInvSlotClass());
customElements.define('inv-slot-invisible', createInvSlotClass());
customElements.define('inv-slot-transparent', createInvSlotClass());
