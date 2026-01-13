import { v, Computation } from "./mycel.js"
import { Block, createItemComponent } from "./utils.js"

let blocks = v([] as Block[])

let titleInput = document.getElementById('title-input')! as HTMLInputElement
let descInput = document.getElementById('desc-input')! as HTMLInputElement

let btn = document.getElementById('add')!

btn.addEventListener(
    'click',
    () => {
        let b = {
            title: titleInput.value,
            desc: descInput.value
        } as Block
        titleInput.value = "";
        descInput.value = "";
        blocks.update(ls => [...ls, b])
    }
)

new Computation (
    (self) => {
        let list = document.getElementById('list')!
        list.textContent = ""
        blocks.read(self).forEach(
            (block) => {
                let el = createItemComponent(block)
                list.appendChild(el)
            }
        )
    }
)