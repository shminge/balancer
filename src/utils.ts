
/**One of the users who have been input */
export type Name = string

export type Transaction = {
    paidBy: Name
    amount: number
    usedBy: Name[] 
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
    button.textContent = "✖"; // bin/cross icon
    button.addEventListener("click", () => onRemove(text));

    container.append(span, button);
    return container;
}

