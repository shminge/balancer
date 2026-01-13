import { v, Computation } from "./mycel.js";
import { createItemComponent } from "./utils.js";
let blocks = v([]);
let titleInput = document.getElementById('title-input');
let descInput = document.getElementById('desc-input');
let btn = document.getElementById('add');
btn.addEventListener('click', () => {
    let b = {
        title: titleInput.value,
        desc: descInput.value
    };
    titleInput.value = "";
    descInput.value = "";
    blocks.update(ls => [...ls, b]);
});
new Computation((self) => {
    let list = document.getElementById('list');
    list.textContent = "";
    blocks.read(self).forEach((block) => {
        let el = createItemComponent(block);
        list.appendChild(el);
    });
});
