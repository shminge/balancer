import { createItemComponent, Name } from "./utils.js"
import { v, Computation } from "./mycel.js"


// Script Setup
const names = v([] as Name[])
const owes = new Map<[Name, Name], number>()

new Computation(
    (self) => {
        const nameList = document.getElementById("names-list")!
        nameList.innerHTML = "" // clear existing names
        for (const name of names.read(self)) {
            const li = document.createElement('li')
            const el = createItemComponent(
                name,
                removeName
            )
            li.appendChild(el);
            nameList.append(li)
        }
    }
)

setup_hooks()

function removeName(name: string) {
    names.update((ls) => ls.filter(n => n !== name))
}



// general dom manipulation

function setup_hooks() {
    const nameInput = document.getElementById('name-input')! as HTMLInputElement
    const addNameBtn = document.getElementById('add-name')!

    function addName() {
        const value = nameInput.value.trim();
        if (!value) return; // skip empty input
        if (names.peek().includes(value as Name)) return;
        names.update((ls) => [...ls, value as Name])
        nameInput.value = ""
    }

    addNameBtn.addEventListener(
        "click",
        addName
    )

    nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addName()
    }
});
}

