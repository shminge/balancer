import { ObservableArray, Name, createItemComponent } from "./utils.js"


// Script Setup
const names = new ObservableArray<Name>()
const owes = new Map<[Name, Name], number>()

names.subscribe(drawNames)

setup_hooks()









// general dom manipulation

function setup_hooks() {
    const nameInput = document.getElementById('name-input')! as HTMLInputElement
    const addNameBtn = document.getElementById('add-name')!

    function addName() {
        const value = nameInput.value.trim();
        if (!value) return; // skip empty input
        if (names.value().includes(value as Name)) return;
        names.push(value as Name)
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

function drawNames(arr: Name[]) {
    const nameList = document.getElementById("names-list")!
    nameList.innerHTML = "" // clear existing names
    for (const name of arr) {
        const li = document.createElement('li')
        const el = createItemComponent(
            name,
            (name) => {
                names.remove(name) // nicer way to strcuture this?
            }
        )
        li.appendChild(el);
        nameList.append(li)
    }
}