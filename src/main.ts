import { v, Computation } from "./mycel.js"

// --- Reactive state ---
const names = v<string[]>([])
const transactions = v<TransactionData[]>([])
const owes = new Map<[string, string], number>()

interface TransactionData {
    id: number
    amount: number
    paidBy: string | null
    beneficiaries: string[]
}

// --- Names list reactive rendering ---
new Computation((self) => {
    const nameList = document.getElementById("names-list")!
    nameList.innerHTML = ""

    for (const name of names.read(self)) {
        const li = document.createElement("li")
        li.textContent = name + " "

        const removeBtn = document.createElement("button")
        removeBtn.textContent = "×"
        removeBtn.addEventListener("click", () => {
            names.update(ls => ls.filter(n => n !== name))
        })
        li.appendChild(removeBtn)
        nameList.appendChild(li)
    }
})

// --- Name input hooks ---
const nameInput = document.getElementById('name-input')! as HTMLInputElement
const addNameBtn = document.getElementById('add-name')!

function addName() {
    const value = nameInput.value.trim()
    if (!value || names.peek().includes(value)) return
    names.update(ls => [...ls, value])
    nameInput.value = ""
}

addNameBtn.addEventListener("click", addName)
nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addName()
})

// --- Transactions management ---
let txCounter = 0
function addTransaction() {
    const newTx: TransactionData = {
        id: txCounter++,
        amount: 0,
        paidBy: names.peek()[0] ?? null,
        beneficiaries: []
    }
    transactions.update(list => [...list, newTx])
    const container = createTransactionComponent(newTx)
    document.getElementById("transactions")!.appendChild(container)
}

document.getElementById("add-transaction")!.addEventListener("click", addTransaction)

// --- Transaction component ---
function createTransactionComponent(tx: TransactionData) {
    const container = document.createElement("div")
    container.className = "transaction"
    container.style.border = "1px solid #ccc"
    container.style.padding = "8px"
    container.style.marginBottom = "8px"

    // Amount input
    const amountInput = document.createElement("input")
    amountInput.type = "number"
    amountInput.value = tx.amount.toString()
    amountInput.style.width = "80px"
    container.appendChild(amountInput)

    // Paid by dropdown
    const paidByDropdown = document.createElement("select")
    container.appendChild(paidByDropdown)

    // Beneficiaries container
    const beneficiariesContainer = document.createElement("div")
    beneficiariesContainer.style.display = "flex"
    beneficiariesContainer.style.gap = "4px"
    container.appendChild(beneficiariesContainer)

    // Add beneficiary button
    const addBeneficiaryBtn = document.createElement("button")
    addBeneficiaryBtn.textContent = "+"
    container.appendChild(addBeneficiaryBtn)

    // Remove transaction button
    const removeTransactionBtn = document.createElement("button")
    removeTransactionBtn.textContent = "Delete Transaction"
    removeTransactionBtn.style.marginLeft = "8px"
    container.appendChild(removeTransactionBtn)

    // --- Handlers ---
    amountInput.addEventListener("input", () => {
        const val = parseFloat(amountInput.value) || 0
        tx.amount = val
        updateOwes()
    })

    // Paid by dropdown computation
    new Computation((self) => {
        const currentNames = names.read(self)
        const currentValue = tx.paidBy
        paidByDropdown.innerHTML = ""
        for (const name of currentNames) {
            const opt = document.createElement("option")
            opt.value = name
            opt.textContent = name
            paidByDropdown.appendChild(opt)
        }

        if (currentValue && currentNames.includes(currentValue)) {
            paidByDropdown.value = currentValue
        } else if (currentNames.length > 0) {
            tx.paidBy = currentNames[0]
            paidByDropdown.value = currentNames[0]
        }
    })

    paidByDropdown.addEventListener("change", () => {
        tx.paidBy = paidByDropdown.value
        updateOwes()
    })

    // Beneficiaries render
    function renderBeneficiaries() {
        beneficiariesContainer.innerHTML = ""
        tx.beneficiaries.forEach((ben, i) => {
            const wrapper = document.createElement("span")
            wrapper.style.display = "flex"
            wrapper.style.alignItems = "center"

            const select = document.createElement("select")
            for (const name of names.peek()) {
                const opt = document.createElement("option")
                opt.value = name
                opt.textContent = name
                select.appendChild(opt)
            }
            select.value = ben
            select.addEventListener("change", () => {
                tx.beneficiaries[i] = select.value
                updateOwes()
            })
            wrapper.appendChild(select)

            const removeBtn = document.createElement("button")
            removeBtn.textContent = "×"
            removeBtn.addEventListener("click", () => {
                tx.beneficiaries.splice(i, 1)
                renderBeneficiaries()
                updateOwes()
            })
            wrapper.appendChild(removeBtn)

            beneficiariesContainer.appendChild(wrapper)
        })
    }

    // Add beneficiary
    addBeneficiaryBtn.addEventListener("click", () => {
        if (names.peek().length === 0) return
        tx.beneficiaries.push(names.peek()[0])
        renderBeneficiaries()
        updateOwes()
    })

    // Initial render
    renderBeneficiaries()

    // Remove transaction
    removeTransactionBtn.addEventListener("click", () => {
        transactions.update(list => list.filter(t => t.id !== tx.id))
        updateOwes()
        container.remove()
    })

    return container
}

// --- Compute owes map ---
function updateOwes() {
    owes.clear()
    for (const tx of transactions.peek()) {
        if (!tx.paidBy || tx.beneficiaries.length === 0) continue
        const share = tx.amount / tx.beneficiaries.length
        for (const ben of tx.beneficiaries) {
            if (ben === tx.paidBy) continue
            owes.set([tx.paidBy, ben], share)
        }
    }
    console.clear()
    console.log("owes map:", owes)
}
