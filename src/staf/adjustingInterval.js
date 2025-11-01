export class AdjustingInterval {
    constructor(workFunc, interval, errorFunc) {
        this.workFunc = workFunc;
        this.interval = interval;
        this.errorFunc = errorFunc;
        this.expected = null;
        this.timeout = null;
        
        this.tps = null
    }
    start() {
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(() => this.step(), this.interval);
    }
    stop() {
        clearTimeout(this.timeout);
    }
    step() {
        this.drift = Date.now() - this.expected;
        if (this.drift > this.interval) {
            if (this.errorFunc) this.errorFunc();
        } 
        this.workFunc();
        this.expected += this.interval;
        this.timeout = setTimeout(
            () => this.step(), 
            Math.max(0, this.tps = this.interval - this.drift)
        );
    }
}