export class StateMachine {
    constructor(initialState) {
        this.currentState = initialState;
        this.states = {};
        this.transitions = {};
    }
    addState(name, { enter, update, exit }) {
        this.states[name] = { enter, update, exit };
        this.transitions[name] = [];
    }
    addTransition(fromState, toState, condition) {
        this.transitions[fromState].push({ toState, condition });
    }
    changeState(newStateName) {
        if (this.currentState && this.states[this.currentState].exit) {
            this.states[this.currentState].exit();
        }
        this.currentState = newStateName;
        if (this.states[this.currentState].enter) {
            this.states[this.currentState].enter();
        }
    }
    update() {
        // Проверяем возможные переходы
        for (const transition of this.transitions[this.currentState]) {
            if (transition.condition()) {
                this.changeState(transition.toState);
                break;
            }
        }
        if (this.states[this.currentState].update) {
            this.states[this.currentState].update();
        }
    }
}