
// ************* Select items *************

const alert =  document.querySelector(".alert");
const form =  document.querySelector(".todo-form");
const todo = document.getElementById("todo");
const submitBtn =  document.querySelector(".submit-btn");
const container =  document.querySelector(".todo-container");
const list =  document.querySelector(".todo-list");
const clearBtn =  document.querySelector(".clear-btn");



// ************* edit Option *************

let editElement;
let editFlag = false;
let editId = "";


// ************* Event Listener *************

// submitform
form.addEventListener("submit",addItem)
// clear item
clearBtn.addEventListener('click',clearItems)
window.addEventListener("DOMContentLoaded",setupItems);

// const deleteBtn = document.querySelector(".delete-btn");
// add event listener to both buttons


// ************* Function *************


function addItem(e){
     e.preventDefault();
     const value = todo.value;
     const id = new Date().getTime().toString();
    // console.log(id);
    if(value && !editFlag){
        createListItem(id, value)
        // display alert
        displayAlert("item added to the list", "success");
        // show container
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id,value);
        //set back to default
        setBackToDefault();
        // console.log("add item to the list");
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert("value changed","success");
        // console.log("editing");
        //edit local storage
        editLocalStorage(editId,value);
        setBackToDefault();
     }
    else{
        displayAlert("Please enter value","danger")

    }

}

//display alert

function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

// Remove alert

setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);

},1000);

}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.todo-item');

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert('empty list', 'danger');
    setBackToDefault();
    localStorage.removeItem("list");
}

// delete Function

function deleteItem(e){
    // console.log("Item delete");
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");

    setBackToDefault();
    removeFromLocalStorage(id);
}

// edit Function

function editItem(e){
    // console.log("Item edited");
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set from value
    todo.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "edit";
}

//set back to default
function setBackToDefault()
{
    todo.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
    // console.log("set back to default");

}

// ************* LocalStorage *************

function addToLocalStorage(id,value){
    // console.log("added to local storage");
    const todo = {id, value};
    let items  = getLocalStorage();
    items.push(todo);
    localStorage.setItem("list",JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function (item){
        if(item.id !==id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));

}

function editLocalStorage(id,value){
    let items = getLocalStorage();
    items = items.map(function (item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

// ************* Setup Items *************

function setupItems(){
    let items = getLocalStorage();

    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id,item.value);
        });
        container.classList.add("show-container");
    }
}


function createListItem(id, value){
    const element = document.createElement('article');
        // add class
        element.classList.add('todo-item');
        // add id
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
        const deleteBtn = element.querySelector(".delete-btn");
        const editBtn = element.querySelector(".edit-btn");
        deleteBtn.addEventListener('click',deleteItem);
        editBtn.addEventListener('click',editItem);


        //append child
        list.appendChild(element);

}
