import { RESOURCES_MANAGER } from "/src/main/manager-resources.js"
import { COORD_FACTORY } from "/src/game/grid.js"

class Input {
    constructor() {}
    initialize(){
        console.log("%cInput :>> initialize", "background-color: green; font-weight: bold");

        this.prev_mouse_local_coord = COORD_FACTORY.create_local(0, 0);
        this.mouse_local_coord = COORD_FACTORY.create_local(0, 0);
        this.mouse_delta = COORD_FACTORY.create_local(0, 0);

        this.actions = {};
        this.keyboardMap = {};
        this.mouseButtonMap = {};
        this.mouseWheelMap = {
            "up": new Set(),
            "down": new Set()
        };
        
        this.justPressedActions = new Set();
        this.justReleasedActions = new Set();
        this.mouseWheelDelta = 0;
        
        this.windowSize = {
            "width": window.innerWidth,
            "height": window.innerHeight
        };
        this.windowResized = false;
        this.isPreventDefault = false;
        this.topElement = null;

        this.setupEventListeners();
        this.setupSettings(RESOURCES_MANAGER.control_setings.default);
    }
    setupSettings(settings){
        for (const actionName in settings) {
            const { keys, mouseButtons, wheelDirections } = settings[actionName];
            this.add_action(actionName, keys, mouseButtons, wheelDirections);
        }
    }
    add_action(actionName, keys = [], mouseButtons = [], wheelDirections = []) {
        this.actions[actionName] = {
            pressed: false,
            justPressed: false,
            justReleased: false
        };
        
        // Привязка клавиш клавиатуры
        for (const key of keys) {
            this.keyboardMap[key] = actionName;
        };
        
        // Привязка кнопок мыши
        for (const button of mouseButtons) {
            this.mouseButtonMap[button] = actionName;
        };
        
        // Привязка направлений колеса мыши
        for (const direction of wheelDirections) {
            if (direction === "up") {
                this.mouseWheelMap.up.add(actionName);
            } else if (direction === "down") {
                this.mouseWheelMap.down.add(actionName);
            }
        };
    }
    setupEventListeners() {
        // Клавиатура
        window.addEventListener('keydown', (event) => {
            const actionName = this.keyboardMap[event.code];
            if (actionName && !this.actions[actionName].pressed) {
                this.actions[actionName].pressed = true;
                this.actions[actionName].justPressed = true;
                this.justPressedActions.add(actionName);
            }
        });
        window.addEventListener('keyup', (event) => {
            const actionName = this.keyboardMap[event.code];
            if (actionName && this.actions[actionName].pressed) {
                this.actions[actionName].pressed = false;
                this.actions[actionName].justReleased = true;
                this.justReleasedActions.add(actionName);
            }
        });
        // Мышь
        window.addEventListener('mousedown', (event) => {
            const actionName = this.mouseButtonMap[event.button];
            if (actionName && !this.actions[actionName].pressed) {
                this.actions[actionName].pressed = true;
                this.actions[actionName].justPressed = true;
                this.justPressedActions.add(actionName);
            }
            if (this.isPreventDefault) event.preventDefault();
        }, { passive: false });
        window.addEventListener('mouseup', (event) => {
            const actionName = this.mouseButtonMap[event.button];
            if (actionName && this.actions[actionName].pressed) {
                this.actions[actionName].pressed = false;
                this.actions[actionName].justReleased = true;
                this.justReleasedActions.add(actionName);
            }
            if (this.isPreventDefault) event.preventDefault();
        }, { passive: false });
        window.addEventListener('mousemove', (event) => {
            this.mouse_local_coord.x = event.clientX;
            this.mouse_local_coord.y = event.clientY;
            const topElement = event.target.closest('[id]');
            if (topElement != this.topElement){
                this.isTopElementChanged = true;
                this.topElement = topElement;
            }
            event.preventDefault();
        }, { passive: false });
        window.addEventListener('mouseover', (event) => {
            const topElement = event.target.closest('[id]');
            if (topElement != this.topElement){
                this.isTopElementChanged = true;
                this.topElement = topElement;
            }
            event.preventDefault();
        });
        // Колесо мыши
        window.addEventListener('wheel', (event) => {
            this.mouseWheelDelta = event.deltaY;
            
            if (event.deltaY < 0) {
                // Прокрутка вверх
                for (const actionName of this.mouseWheelMap.up) {
                    this.actions[actionName].justPressed = true;
                    this.justPressedActions.add(actionName);
                }
            } else if (event.deltaY > 0) {
                // Прокрутка вниз
                for (const actionName of this.mouseWheelMap.down) {
                    this.actions[actionName].justPressed = true;
                    this.justPressedActions.add(actionName);
                }
            }
            if (this.isPreventDefault) event.preventDefault();
        }, { passive: false });
        // Прочее
        window.addEventListener('resize', () => {
            this.windowSize.width = window.innerWidth;
            this.windowSize.height = window.innerHeight;
            this.windowResized = true;
        });
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }
    
    set_prevent_default = (bool) => (this.isPreventDefault = bool);

    is_action_pressed = (actionName) => this.actions[actionName]?.pressed || false;
    is_action_just_pressed = (actionName) => this.actions[actionName]?.justPressed || false;
    is_action_just_released = (actionName) => this.actions[actionName]?.justReleased || false;

    reset_action_pressed = (actionName) => this.actions[actionName].pressed = false;
    reset_action_just_pressed = (actionName) => this.actions[actionName].justPressed = false;
    reset_action_just_released = (actionName) => this.actions[actionName].justReleased = false;

    is_mouse_move = () => this.isMouseMove;
    is_window_resized = () => this.windowResized;
    is_top_element_changed = () => this.isTopElementChanged;
    
    get_window_size = () => this.windowSize;
    get_mouse_local_coord = () => this.mouse_local_coord;
    get_mouse_delta_local_coord = () => this.mouse_delta;

    update() {
        this.mouse_delta.x = this.mouse_local_coord.x - this.prev_mouse_local_coord.x;
        this.mouse_delta.y = this.mouse_local_coord.y - this.prev_mouse_local_coord.y;
        this.isMouseMove = this.mouse_delta.x == 0 && this.mouse_delta.y == 0 ? false:true;
        this.prev_mouse_local_coord.x = this.mouse_local_coord.x;
        this.prev_mouse_local_coord.y = this.mouse_local_coord.y;
        
        for (const actionName in this.actions) {
            this.actions[actionName].justPressed = false;
            this.actions[actionName].justReleased = false;
        }
        
        this.justPressedActions.clear();
        this.justReleasedActions.clear();
        this.mouseWheelDelta = 0;
        this.windowResized = false;
        this.isTopElementChanged = false;

        this.previousTouches = {...this.activeTouches};

        // console.log('this.topElement :>> ', this.topElement?.closest('div[hud-id]'));
    }
}

export const INPUT_MANAGER = new Input();