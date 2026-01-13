/**
 * Creates a component for the things to render
 * @param text
 * @param onRemove
 * @returns
 */
export function createItemComponent(item) {
    const container = document.createElement("div");
    container.className = "item";
    const h1 = document.createElement("h1");
    h1.textContent = item.title;
    const desc = document.createElement("p");
    desc.textContent = item.desc;
    container.append(h1, desc);
    return container;
}
