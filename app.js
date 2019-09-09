const StorageCtrl = (function() {

    return {
        /*when getting the items, 'items' is optional*/
        initItems: function(items) {
            if (localStorage.getItem('food items') === null) {
                return items = [];
            } else {
                return items = JSON.parse(localStorage.getItem('food items'));
            }
        },

        storeItem: function(newItem) {
            let items;

            items = StorageCtrl.initItems(items);
            items.push(newItem);
            localStorage.setItem('food items', JSON.stringify(items));
        },

        removeItemFromLS: function(id) {
            let items;

            items = StorageCtrl.initItems(items);
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    console.log(items[i]);
                    items.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem('food items', JSON.stringify(items));
        },

        removeAllItemsFromLS: function(id) {
            localStorage.setItem('food items', JSON.stringify([]));
        },

        updateItemInLS: function(updatedItem) {
            let items;
            const caloriesNum = parseInt(updatedItem.calories);

            items = StorageCtrl.initItems(items);

            for (let i = 0; i < items.length; i++) {
                if (items[i].id === updatedItem.id) {
                    items[i].name = updatedItem.name;
                    items[i].calories = caloriesNum;
                    // can use the next line - update whole item insead of parts of it.
                    // items.splice(i, 1, updatedItem);
                    break;
                }
            }
            localStorage.setItem('food items', JSON.stringify(items));
        },


        getDataFromLS: function() {
            let items, totalCal = 0;

            items = StorageCtrl.initItems();
            items.forEach(function(item) {
                totalCal += item.calories;
            });

            return {
                items: items,
                totalCal: totalCal
            }
        }

    }
})();

const ItemCtrl = (function() {
    const Item = function(id, name, calories) {
        this.id  = id;
        this.name =  name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getDataFromLS().items,
        currentItem: null,
        totalCalories: StorageCtrl.getDataFromLS().totalCal
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
            const container = document.querySelector('form .input-container');
            container.appendChild(document.querySelector('#item-input'));
            container.appendChild(document.querySelector('#calories-input'));

            document.querySelector(UISelectors.editSection).classList.add("modal-hide");
            document.querySelector(UISelectors.editSection).classList.remove("modal-show");
            document.querySelector(".modal-background").style.display = 'none';


            document.querySelector(UISelectors.addButton).style.display = 'inline-block';
            document.querySelector(UISelectors.clearButton).style.display = 'inline-block';
        },

        showEditState: function() {

            document.querySelector(UISelectors.editSection).classList.add("modal-show");
            document.querySelector(UISelectors.editSection).classList.remove("modal-hide");
            document.querySelector(".modal-background").style.display = 'block';

            
            const container = document.querySelector('.modal-content-edit .input-container');
            container.appendChild(document.querySelector('#item-input'));
            container.appendChild(document.querySelector('#calories-input'));
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
                document.querySelector(".modal-background").style.display = 'block';
                document.querySelector(".modal").classList.remove("modal-hide");
                document.querySelector(".modal").classList.add("modal-show");

            }
        },

        hideModal: function(e) {
            if (e.target.classList.contains('close')) {
                document.querySelector(".modal-background").style.display = 'none';
                document.querySelector(".modal").classList.add("modal-hide");
                document.querySelector(".modal").classList.remove("modal-show");
            }
        },

        showStickyNavigation: function() {
            const form = document.querySelector('form');
            const sticky = form.offsetTop;

            if (window.pageYOffset > sticky) {
                form.classList.add("sticky")
            } else /*if (window.pageYOffset < sticky - 100)*/{
                form.classList.remove("sticky");
            }
        
        }
    }
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {

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
        StorageCtrl.storeItem(newItem);
        UICtrl.clearInput();
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
        const itemInput = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(itemInput.name, itemInput.calories);

        UICtrl.updateListItem(updatedItem);
        StorageCtrl.updateItemInLS(updatedItem);
    }

    function removeItem() {
        const currentItem = ItemCtrl.getCurrItem();

        ItemCtrl.deleteItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
        StorageCtrl.removeItemFromLS(currentItem.id);
        console.log(currentItem.id);
    }

    function clearAll(e) {
        ItemCtrl.deleteAllItems();
        UICtrl.deleteAllListItems();
        StorageCtrl.removeAllItemsFromLS();
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
        document.addEventListener('scroll', UICtrl.showStickyNavigation);
        window.onscroll = UICtrl.showStickyNavigation;


    }

    return {
        init: function() {
            const items = ItemCtrl.getItems();

            UICtrl.clearEditState();
            UICtrl.populateItemList(items);
            const totalCal = ItemCtrl.getTotalCal();
            UICtrl.showTotalCal(totalCal);
            loadEventListeners();
        }

    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
