

/**One of the users who have been input */
export type Name = string

export type Transaction = {
    paidBy: Name
    amount: number
    usedBy: Name[] 
}

/**
 * An array that can notify watchers of changes
 */
export class ObservableArray<T> {
    private arr: T[] = []
    private observers: ((arr: T[]) => void)[] = [];

    subscribe(fn: (arr: T[]) => void) {
        this.observers.push(fn)
    }

    notify() {
        for (const fn of this.observers) {
            fn(this.arr)
        }
    }

    push(item: T) {
        this.arr.push(item)
        this.notify()
    }

    remove(item: T) {
        const index = this.arr.indexOf(item)
        if (index > -1) {
            this.arr.splice(index, 1)
            this.notify()
        }
    } 

    value(): readonly T[] {
        return this.arr
    }
}


/**
 * Creates a component for the things to render
 * @param text 
 * @param onRemove 
 * @returns 
 */
export function createItemComponent(text: string, onRemove: (text: string) => void): HTMLElement {
    const container = document.createElement("div");
    container.className = "item";

    const span = document.createElement("span");
    span.textContent = text;

    const button = document.createElement("button");
    button.textContent = "✖";
    button.addEventListener("click", () => onRemove(text));

    container.append(span, button);
    return container;
}


export function createDropdown(arr: Name[], onRemove: ) {
    const container = document.createElement("div");
    container.className = "name-dropdown";

    const span = document.createElement("span");
    span.textContent = text;

    const button = document.createElement("button");
    button.textContent = "✖";
    button.addEventListener("click", () => onRemove(text));

    container.append(span, button);
    return container;
}