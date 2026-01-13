let currentEpoch = 0;

let batching = false;

const runQueue: Computation[] = []
let flushing = false


function schedule(comp: Computation) {
    if (comp.lastRunEpoch === currentEpoch) return
    comp.lastRunEpoch = currentEpoch
    runQueue.push(comp)
}

function flushQueue() {
    if (flushing) return
        flushing = true
        currentEpoch++
    try {
        while (runQueue.length > 0) {
            const comp = runQueue.pop()!
            comp.scheduled = false
            comp.run()
        }
    } finally {
        flushing = false
    }
}


/**
 * Wrapper for a reactive computation.
 */
export class Computation {
    fn: (comp: Computation) => void;
    scheduled = false
    lastRunEpoch = -1

    constructor(fn: (self: Computation) => void) {
    this.fn = fn
    this.run()
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
export function v<T>(val: T): Reactive<T> {
    return new Reactive<T>(val)
}


/**
 * A reactive object
 */
export class Reactive<T> {
    private value: T;
    private listeners: Set<Computation> = new Set();

    constructor(val: T) {
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
    read(comp: Computation) {
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
                fn.run()
            }
        }
    }

    /**
     * Set and update listeners
     * @param val 
     */
    set(val: T) {
        this.value = val;
        this.notify();
    }
    
    /**
     * Set without updating listeners. This should be used in conjunction with `notify()` later.
     * @param val 
     */
    setSilent(val: T) {
        this.value = val;
    }

    /**
     * Helper function for setting things nicely with current value as context
     * @param fn 
     */
    update(fn: (current: T) => T) {
        this.set(fn(this.value))
    } 

}

/**
 * Execute the code completely first, and update everything at the end
 * @param fn 
 */
export function batch(fn: () => void) {
    const prev = batching
    batching = true
    try {
        fn()
    } finally {
        batching = prev
        flushQueue()
    }
}
