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
