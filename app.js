// const taskList = document.querySelector('.food-items');
// const addButton = document.querySelector('.add-task');
// const clearButton = document.querySelector('.clear-tasks');
// const taskInput = document.querySelector('#item-input');
//
// /* ----------------------------- */
// /* ----- HELPING FUNCTIONS ----- */
// function addIconToTask(listItem) {
//     const icon = document.createElement('a');
//     icon.className = 'ion-edit delete-task icon-delete icons';
//     listItem.appendChild(icon);
// }
//
// function addTask(listName, content) {
//     const li = document.createElement('li');
//
//     li.appendChild(document.createTextNode(content));
//     addIconToTask(li);
//     listName.appendChild(li);
// }
//
// function initTasksInLS(tasks) {
//     if (localStorage.getItem('tasks') === null) {
//         return tasks = [];
//     } else {
//         return tasks = JSON.parse(localStorage.getItem('tasks'));
//     }
// }
//
// function initFinishedTasksInLS(finishedTasks) {
//     if (localStorage.getItem('finishedTasks') === null) {
//         return finishedTasks = [];
//     } else {
//         return finishedTasks = JSON.parse(localStorage.getItem('finishedTasks'));
//     }
// }
//
// function removeTaskFromLS(task) {
//     let tasks;
//
//     tasks = initTasksInLS(tasks);
//     tasks.forEach(function(taskItem, index) {
//         if (task.textContent === taskItem) {
//             tasks.splice(index, 1);
//         }
//     });
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// }
//
//
//
// function storeInLS(task) {
//     let tasks;
//
//     tasks = initTasksInLS(tasks);
//     tasks.push(task);
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// }
//
// function addTaskToTaskList() {
//     addTask(taskList, taskInput.value);
//     storeInLS(taskInput.value);
//     taskInput.value = '';
// }
//
// /* ----------------------------- */
//
// function addAfterClick() {
//     if (taskInput.value.length > 0) {
//         addTaskToTaskList();
//     }
// }
//
// function addAfterKeyPress() {
//     if (taskInput.value.length > 0 && event.which == 13) {
//         addTaskToTaskList();
//     }
// }
//
// function deleteListItem(e) {
//     const task = e.target;
//
//     if (task.parentElement.classList.contains('food-items')) {
//         let finishedTasks;
//
//         addTaskToFinished(task);
//         removeTaskFromLS(task);
//         finishedTasks = initFinishedTasksInLS(finishedTasks);
//         finishedTasks.push(task.textContent);
//         localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
//         task.remove();
//     }
//
//     if (task.classList.contains('icon-delete')) {
//         if (task.parentElement.parentElement.classList.contains('food-items')) {
//             removeTaskFromLS(task.parentElement);
//         }
//         else {
//             removeFinishedTaskFromLS(task.parentElement);
//         }
//         task.parentElement.remove();
//     }
// }
//
// function clearFinished() {
//     while (finishedTaskList.firstChild) {
//         removeFinishedTaskFromLS(finishedTaskList.firstChild);
//         finishedTaskList.removeChild(finishedTaskList.firstChild);
//     }
// }
//
//
//
// function getTasks() {
//     let tasks, finishedTasks;
//
//     tasks = initTasksInLS(tasks);
//     finishedTasks = initFinishedTasksInLS(finishedTasks);
//
//     tasks.forEach(function(task) {
//         addTask(taskList, task);
//     });
//     finishedTasks.forEach(function(task) {
//         addTask(finishedTaskList, task);
//     });
// }
//
// function loadEventListeners() {
//     addButton.addEventListener('click', addAfterClick);
//     taskInput.addEventListener('keypress', addAfterKeyPress);
//     taskList.addEventListener('click', deleteListItem);
//     finishedTaskList.addEventListener('click', deleteListItem);
//     document.addEventListener('DOMContentLoaded', getTasks);
// }
//
// loadEventListeners();

const ItemCtrl = (function() {
    const Item = function(id, name, calories) {
        this.id  = id;
        this.name =  name;
        this.calories = calories;
    }

    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },

        addItem: function(name, calories) {
            let id;
            const caloriesNum = parseInt(calories);

            data.totalCalories += caloriesNum;

            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newItem = new Item(id, name, caloriesNum);
            data.items.push(newItem);
            return newItem;
        },

        getItemById: function(id) {
            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i].id === id) {
                    return data.items[i];
                }
            }
        },

        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        getCurrItem: function() {
            return data.currentItem;
        },

        updateItem: function(name, calories) {
            const caloriesNum = parseInt(calories);

            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i].id === data.currentItem.id) {
                    // update total calories
                    if (data.currentItem.calories > caloriesNum) {
                        data.totalCalories -= (data.currentItem.calories - caloriesNum);
                    } else {
                        data.totalCalories += (caloriesNum - data.currentItem.calories);
                    }

                    // update item
                    data.items[i].name = name;
                    data.items[i].calories = caloriesNum;

                    return data.items[i];
                }
            }
        },

        deleteItem: function(id) {
            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i].id === id) {
                    data.totalCalories -= data.items[i].calories;
                    data.items.splice(i, 1);
                    break;
                }
            }
        },

        deleteAllItems: function() {
            data.items = [];
            data.totalCalories = 0;
        },

        getTotalCal: function() {
            return data.totalCalories;
        },

        logData: function() {
            return data;
        }
    }
})();

const UICtrl = (function() {
    const UISelectors = {
        itemList: '.food-items',
        listItem: 'li',
        addButton: 'input[type=submit]',
        clearButton: '.btn',
        editSection: '.sec-edit',
        updateButton: '.icon-update',
        deleteButton: '.icon-delete',
        backButton: '.icon-back',
        modal: '.modal',
        modalButtonV: '.btn-modal-v',
        modalButtonX: '.btn-modal-x',
        itemInput: '#item-input',
        caloriesInput: '#calories-input',
        totalCalories: 'h2 span'
    }

    return {
        addListItem: function(item) {
            const listItem = document.createElement('li');

            // listItem.className = 'some-class';
            listItem.id = `item-${item.id}`;
            listItem.innerHTML = `
                <strong>${item.name}:</strong>&#160;&#160;&#160;
                <em>${item.calories} calories</em>
                <a href="#/" class="ion-edit icon-edit icons"></a>
            `;
            document.querySelector(UISelectors.itemList).appendChild(listItem);
        },

        clearInput: function() {
            const itemInput = document.querySelector(UISelectors.itemInput);

            itemInput.value = '';
            document.querySelector(UISelectors.caloriesInput).value = '';
            itemInput.focus();
        },

        showTotalCal: function(totalCal) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCal;
        },

        populateItemList: function(items) {
            let html = '';

            items.forEach(item => {
                html += `<li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}:</strong>&#160;&#160;&#160;
                    <em>${item.calories} calories</em>
                    <a href="#/" class="ion-edit icon-edit icons"></a>
                    </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getSelectors: function() {
            return UISelectors;
        },

        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.editSection).style.display = 'none';
            document.querySelector(UISelectors.addButton).style.display = 'inline-block';
            document.querySelector(UISelectors.clearButton).style.display = 'inline-block';
        },

        showEditState: function() {
            document.querySelector(UISelectors.editSection).style.display = 'flex';
            document.querySelector(UISelectors.addButton).style.display = 'none';
            document.querySelector(UISelectors.clearButton).style.display = 'none';
        },

        IsEditState: function() {
            if (document.querySelector(UISelectors.editSection).style.display === 'flex') {
                return true;
            }
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.itemInput).value = ItemCtrl.getCurrItem().name;
            document.querySelector(UISelectors.caloriesInput).value = ItemCtrl.getCurrItem().calories;
            UICtrl.showEditState();
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemInput).value,
                calories: document.querySelector(UISelectors.caloriesInput).value
            }
        },

        updateListItem: function(updatedItem) {
            let listItems = document.querySelectorAll(UISelectors.listItem);
            let found = null;

            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].id === `item-${updatedItem.id}`) {
                    found = document.querySelector(`#${listItems[i].id}`);
                    found.innerHTML = `
                        <strong>${updatedItem.name}:</strong>&#160;&#160;&#160;
                        <em>${updatedItem.calories} calories</em>
                        <a href="#/" class="ion-edit icon-edit icons"></a>
                    `;
                    break;
                }
            }
            UICtrl.clearEditState();
            const totalCal = ItemCtrl.getTotalCal();
            UICtrl.showTotalCal(totalCal);
        },

        deleteListItem: function(id) {
            const itemId = `#item-${id}`;

            document.querySelector(itemId).remove();
            UICtrl.clearEditState();
            const totalCal = ItemCtrl.getTotalCal();
            UICtrl.showTotalCal(totalCal);
        },

        deleteAllListItems: function() {
            document.querySelector(UISelectors.itemList).innerHTML = '';
            const totalCal = ItemCtrl.getTotalCal();
            UICtrl.showTotalCal(totalCal);
        },

        showModal: function() {
            const items = ItemCtrl.getItems();

            if (items.length) {
                document.querySelector(UISelectors.modal).style.display = 'block';
            }
        },

        hideModal: function(e) {
            if (e.target.classList.contains('close')) {
                document.querySelector(UISelectors.modal).style.display = 'none';
            }
        }
    }
})();

const App = (function(ItemCtrl, UICtrl) {
    function submitItem(e) {
        const input = UICtrl.getItemInput();

        e.preventDefault(); /* prevents the default setting and sending of a form */
        if (input.name === '' || input.calories === '') {
            return;     //also can generate an error
        }

        const newItem = ItemCtrl.addItem(input.name, input.calories);
        UICtrl.addListItem(newItem);
        const totalCal = ItemCtrl.getTotalCal();
        UICtrl.showTotalCal(totalCal);
        UICtrl.clearEditState();
    }

    function editItem(e) {
        if (e.target.classList.contains('icon-edit')) {
            const listItemId = e.target.parentElement.id;
            const listItemIdArr = listItemId.split('-');
            const id = parseInt(listItemIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
    }

    function updateItem() {
        console.log('test');
        const itemInput = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(itemInput.name, itemInput.calories);

        UICtrl.updateListItem(updatedItem);
    }

    function removeItem() {
        const currentItem = ItemCtrl.getCurrItem();

        ItemCtrl.deleteItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
    }

    function clearAll(e) {
        ItemCtrl.deleteAllItems();
        UICtrl.deleteAllListItems();
        e.target.classList.add('close');
    }

    function loadEventListeners() {
        const uiSelectors = UICtrl.getSelectors();

        document.addEventListener('keypress', e => {
            if (e.which === 13 && UICtrl.IsEditState() === true) {
                e.preventDefault();
            }
        });
        document.querySelector(uiSelectors.addButton).addEventListener('click', submitItem);
        document.querySelector(uiSelectors.itemList).addEventListener('click', editItem);
        document.querySelector(uiSelectors.updateButton).addEventListener('click', updateItem);
        document.querySelector(uiSelectors.backButton).addEventListener('click', UICtrl.clearEditState);
        document.querySelector(uiSelectors.deleteButton).addEventListener('click', removeItem);
        document.querySelector(uiSelectors.modalButtonV).addEventListener('click', clearAll);
        document.querySelector(uiSelectors.clearButton).addEventListener('click', UICtrl.showModal);
        document.querySelector(uiSelectors.modal).addEventListener('click', e => UICtrl.hideModal(e));
    }

    return {
        init: function() {
            const items = ItemCtrl.getItems();

            UICtrl.clearEditState();
            UICtrl.populateItemList(items);
            loadEventListeners();
        }

    }

})(ItemCtrl, UICtrl);

App.init();
