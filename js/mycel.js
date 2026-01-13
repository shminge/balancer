let currentEpoch = 0;
let batching = false;
const runQueue = [];
let flushing = false;
function schedule(comp) {
    if (comp.lastRunEpoch === currentEpoch)
        return;
    comp.lastRunEpoch = currentEpoch;
    runQueue.push(comp);
}
function flushQueue() {
    if (flushing)
        return;
    flushing = true;
    currentEpoch++;
    try {
        while (runQueue.length > 0) {
            const comp = runQueue.pop();
            comp.scheduled = false;
            comp.run();
        }
    }
    finally {
        flushing = false;
    }
}
/**
 * Wrapper for a reactive computation.
 */
export class Computation {
    fn;
    scheduled = false;
    lastRunEpoch = -1;
    constructor(fn) {
        this.fn = fn;
        this.run();
    }
    run() {
        this.scheduled = false;
        this.fn(this);
    }
}
/**
 *
 * @param val inital reactive state
 * @returns the reactive object
 */
export function v(val) {
    return new Reactive(val);
}
/**
 * A reactive object
 */
export class Reactive {
    value;
    listeners = new Set();
    constructor(val) {
        this.value = val;
    }
    /**
     * Peeks at the value without introducing a subscription
     * @returns value
     */
    peek() {
        return this.value;
    }
    // Attaches a computation to re-run when the value changes
    read(comp) {
        this.listeners.add(comp);
        return this.value;
    }
    /**
     * Update all listeners
     */
    notify() {
        currentEpoch++;
        const toRun = [...this.listeners];
        this.listeners.clear();
        for (let fn of toRun) {
            if (fn.lastRunEpoch != currentEpoch) {
                fn.run();
            }
        }
    }
    /**
     * Set and update listeners
     * @param val
     */
    set(val) {
        this.value = val;
        this.notify();
    }
    /**
     * Set without updating listeners. This should be used in conjunction with `notify()` later.
     * @param val
     */
    setSilent(val) {
        this.value = val;
    }
    /**
     * Helper function for setting things nicely with current value as context
     * @param fn
     */
    update(fn) {
        this.set(fn(this.value));
    }
}
/**
 * Execute the code completely first, and update everything at the end
 * @param fn
 */
export function batch(fn) {
    const prev = batching;
    batching = true;
    try {
        fn();
    }
    finally {
        batching = prev;
        flushQueue();
    }
}
