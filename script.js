const clear = document.querySelector('.clear');
const list = document.getElementById('list');
const input = document.getElementById('input');
const add = document.querySelector('.fa-plus-square');
const remove = document.querySelector('.fa-trash-o');
const edit = document.querySelector('.fa-pencil-square-o');
const item = document.querySelector('.item');
const saveButton = document.querySelector('.fa-floppy-o');
const warning = document.getElementById('warning');
const save = 'fa fa-floppy-o'
const check  = "fa-check-circle-o";
const uncheck = "fa-circle-o";
const line_through = "lineThrough";

let totalList = [];
let id = 0;

//Get item from local storage
let data = localStorage.getItem("TODO");

function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash)
    })
}

//Check if data is empty
if (data){
    totalList = JSON.parse(data);
    id = totalList.length;
    loadList(totalList);
    warning.style.display = "none";
} else {
    totalList = [];
    id = 0;
}

//Create new to do element//
function addToDo (toDo, id, done, trash) {
    if (trash) {
        return;
    }
    if (toDo == "") {
        warning.style.display = "block";
        return;
    }
    const DONE = done ? check : uncheck;
    const LINE = done ? line_through : "";
    const newItem = `<li class="item">
                        <i class="fa ${DONE}" aria-hidden="true" job="complete" id="${id}"></i>
                        <p class="text ${LINE}" job="to-do" id="${id}">${toDo}</p>
                        <i class="fa fa-pencil-square-o" aria-hidden="true" job="edit" id="${id}"></i>
                        <i class="fa fa-trash-o" aria-hidden="true" job="delete" id="${id}"></i>
                    </li>`
    list.insertAdjacentHTML("beforeend", newItem);
    warning.style.display = "none";
}

//Add to do with click//
add.onclick = function () {
    const toDo = input.value;
        if (addToDo) {
            addToDo(toDo, id, false, false);
            totalList.push(
                {
                    name: toDo,
                    id: id,
                    done: false,
                    trash: false
                }
            )
            //Add item to local storage
            localStorage.setItem("TODO", JSON.stringify(totalList))
        }
        input.value = "";
        id++;
}

//Add to do with enter//
input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        const toDo = input.value;
        if (addToDo) {
            addToDo(toDo, id, false, false);
            totalList.push(
                {
                    name: toDo,
                    id: id,
                    done: false,
                    trash: false
                }
            )
            //Add item to local storage
            localStorage.setItem("TODO", JSON.stringify(totalList))
        }
        input.value = "";
        id++;
    }
});

//Clear all to do's//
clear.onclick = function() {
    const answer = window.confirm("Are you sure? You will clear all to do items!")
    if (answer) {
        list.innerHTML = "";
    };
}

//Complete a to do item//
function completeToDo(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(line_through);
    totalList[element.id].done = totalList[element.id].done ? false : true;
    //Add item to local storage
    localStorage.setItem("TODO", JSON.stringify(totalList))
}

//Remove a to do item//
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    totalList[element.id].trash = true;
    //Add item to local storage
    localStorage.setItem("TODO", JSON.stringify(totalList))
}

//Edit the to do item
function editToDo(element) {
    const item = element.parentNode;
    const toDo = item.firstElementChild.nextElementSibling;
    const removeItem = item.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling;
    const saveItem = document.createElement('i');
    const input = document.createElement('input');
    const check = element.parentNode.firstElementChild;
    input.type = 'text';
    input.value = toDo.textContent;
    input.className = 'change-text';
    input.setAttribute("job", "editText");
    input.setAttribute("id", element.id);
    saveItem.className = save;
    saveItem.setAttribute("job", "save");
    saveItem.setAttribute("id", element.id)
    item.insertBefore(input, toDo);
    item.removeChild(toDo);
    item.removeChild(element);
    item.insertBefore(saveItem, removeItem);
}

//Update the text element in the to do item after changing
function completeEdit(element) {
    const editItem = document.createElement('i')
    editItem.setAttribute("job", "edit")
    editItem.setAttribute("id", element.id);
    const saveItem = element.parentNode.firstElementChild.nextElementSibling.nextElementSibling;
    const item = element.parentNode;
    const currentToDo = item.firstElementChild.nextElementSibling;
    const updatedToDo = document.createElement('p');
    editItem.className = 'fa fa-pencil-square-o';
    updatedToDo.className = 'text';
    updatedToDo.setAttribute("job", "to-do");
    updatedToDo.setAttribute("id", element.id);
    updatedToDo.innerHTML = currentToDo.value;
    item.insertBefore(updatedToDo, currentToDo);
    item.removeChild(currentToDo);
    item.removeChild(saveItem);
    item.insertBefore(editItem, item.firstElementChild.nextElementSibling.nextElementSibling);
    totalList[element.id].name = updatedToDo.textContent
    //Add item to local storage
    localStorage.setItem("TODO", JSON.stringify(totalList))
}

//Complete, remove, edit or save within an item by clicking on an icon.
list.addEventListener("click", function(event) {
    let element = event.target;
    const elementJob = event.target.attributes.job.value;
    if (elementJob == "complete") {
        //Disable checking off to do when editing the text
        if (element.parentNode.firstElementChild.nextElementSibling.nextElementSibling.attributes.job.value === "save") {
            return;
        } else {
            completeToDo(element);
        }
    } else if (elementJob == "delete"){
        removeToDo(element);
    } else if (elementJob == "edit"){
        const status = element.parentNode.firstElementChild;
        if (status.className === "fa fa-check-circle-o") {
            return;
        } else {
            editToDo(element);
        }
    } else if (elementJob == "save") {
        if (element.parentNode.firstElementChild.nextElementSibling.value == ""){
            return;
        } else {
            completeEdit(element);
        }
    } else {
        return;
    }
})

//Save edit with enter key.
list.addEventListener("keyup", function(event) {
    let element = event.target;
    const elementJob = event.target.attributes.job.value;
    if (elementJob == "editText") {
        if (event.key === 'Enter' && element.value != ""){
            completeEdit(element);
        }
    } 
})