import {initializeApp} from 'firebase/app'
import {getDatabase, ref, push, onValue, remove, query, equalTo, orderByChild} from "firebase/database"
import {v4 as uuid} from 'uuid'

const appSettings = {
    databaseURL: "https://playground-864be-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

let user = null

if (localStorage.getItem('user')) {
    user = localStorage.getItem('user')
} else {
    user = uuid()

    localStorage.setItem('user', user)
}

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value

    if (inputValue === "") {
        alert("Ürün girmediniz")

        return
    }

    push(shoppingListInDB, {user: user, value: inputValue})

    clearInputFieldEl()
})

onValue(query(shoppingListInDB, orderByChild('user'), equalTo(user)), function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "Hiç ürün girmediniz... :)"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]?.value

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}