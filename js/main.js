import { createItemComponent } from "./utils.js";
import { v, Computation } from "./mycel.js";
// Script Setup
const names = v([]);
const owes = new Map();
new Computation((self) => {
    const nameList = document.getElementById("names-list");
    nameList.innerHTML = ""; // clear existing names
    for (const name of names.read(self)) {
        const li = document.createElement('li');
        const el = createItemComponent(name, removeName);
        li.appendChild(el);
        nameList.append(li);
    }
});
setup_hooks();
function removeName(name) {
    names.update((ls) => ls.filter(n => n !== name));
}
// general dom manipulation
function setup_hooks() {
    const nameInput = document.getElementById('name-input');
    const addNameBtn = document.getElementById('add-name');
    function addName() {
        const value = nameInput.value.trim();
        if (!value)
            return; // skip empty input
        if (names.peek().includes(value))
            return;
        names.update((ls) => [...ls, value]);
        nameInput.value = "";
    }
    addNameBtn.addEventListener("click", addName);
    nameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addName();
        }
    });
}
