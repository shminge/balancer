import { Computation, v } from "./mycel.js"

let countEl = document.getElementById('count')!
let button = document.getElementById('button')!

let count = v(0)

let comp = new Computation (
    (self) => countEl.textContent = `Count is ${count.read(self)}`
)


button.addEventListener(
    "click",
    () => {
        count.set(count.peek() + 1)
    }
)