/**
 * An array that can notify watchers of changes
 */
export class ObservableArray {
    arr = [];
    observers = [];
    subscribe(fn) {
        this.observers.push(fn);
    }
    notify() {
        for (const fn of this.observers) {
            fn(this.arr);
        }
    }
    push(item) {
        this.arr.push(item);
        this.notify();
    }
    remove(item) {
        const index = this.arr.indexOf(item);
        if (index > -1) {
            this.arr.splice(index, 1);
            this.notify();
        }
    }
    value() {
        return this.arr;
    }
}
/**
 * Creates a component for the things to render
 * @param text
 * @param onRemove
 * @returns
 */
export function createItemComponent(text, onRemove) {
    const container = document.createElement("div");
    container.className = "item";
    const span = document.createElement("span");
    span.textContent = text;
    const button = document.createElement("button");
    button.textContent = "✖"; // bin/cross icon
    button.addEventListener("click", () => onRemove(text));
    container.append(span, button);
    return container;
}
