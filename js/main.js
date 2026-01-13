import { Computation, v } from "./mycel.js";
let countEl = document.getElementById('count');
let button = document.getElementById('button');
let count = v(0);
let double = v(count.peek());
let comp = new Computation((self) => { countEl.textContent = `Count is ${count.read(self)}, double is ${double.read(self)}`; console.log('foo'); });
let comp2 = new Computation((self) => double.set(count.read(self) * 2));
button.addEventListener("click", () => {
    count.set(count.peek() + 1);
});
