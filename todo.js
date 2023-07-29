const field = document.querySelector('.field');
// поменять название переменной, класса
const btnAdd = document.querySelector('.add');
const currentTasksList = document.querySelector('.current-tasks-list');
const completedTasksList = document.querySelector('.completed-tasks-list');
const deletedTasksList = document.querySelector('.deleted-tasks-list');
// поменять название переменной, класса
const btnDelete = document.querySelectorAll('.delete-btn');
// поменять название переменной, не пойми, что удаляешь
const btnDeleteAll = document.querySelectorAll('.delete-all');

let currentTasksArr = []; 
let completedTasksArr = [];
let deletedTasksArr = [];

getListFromStorage();

function createTask(value) {
    const newLi = document.createElement('li');
    newLi.classList.add('task-text');

    const task = document.createElement('div');
    // можно убрать "-div" у класса;
    task.classList.add('task-div');

    const checkBox = document.createElement('input');
    // класс, как минимум, toggle-completed
    checkBox.classList.add('status');
    checkBox.type = "checkbox";
    task.appendChild(checkBox);

    const taskText = document.createElement('span');
    taskText.textContent = value;
    task.appendChild(taskText);
    
    // нужно ответить на вопрос, что эта кнопка делает
    // неинформативное название
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.classList.add('delete-btn');
        
    newLi.appendChild(task);
    newLi.appendChild(deleteButton);
    
    return newLi;
}

function addTaskToCurrentTasks() {
    const newTask = createTask(field.value);

    currentTasksList.appendChild(newTask);
    currentTasksArr.push(newTask);
    field.value = '';
    
    saveListToStorage();
}

field.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && field.value !== '') {
        addTaskToCurrentTasks();
    }
});

btnAdd.addEventListener('click', function() {
    if (field.value !== '') {
        addTaskToCurrentTasks();
    }
});

currentTasksList.addEventListener('click', function(event) {
    const target = event.target; 
        if (target.tagName === 'INPUT') {
        target.nextSibling.classList.add("checked");
        
        currentTasksList.removeChild(target.parentElement.parentElement) && completedTasksList.appendChild(target.parentElement.parentElement);
        
        const indexOfTargetedTask = currentTasksArr.findIndex(i => i == target.parentElement.parentElement);
        const movableCheckedTask = currentTasksArr.splice(indexOfTargetedTask, 1)[0];
        completedTasksArr.splice(completedTasksArr.length, 1, movableCheckedTask);
        
    } else if(target.tagName === 'BUTTON') {
        currentTasksList.removeChild(target.parentElement) && deletedTasksList.appendChild(target.parentElement);
        
        const indexOfTask = currentTasksArr.findIndex(i => i == target.parentElement);
        const movableCheckedTask = currentTasksArr.splice(indexOfTask, 1)[0];
        deletedTasksArr.splice(deletedTasksArr.length, 1, movableCheckedTask);
    }

    
    saveListToStorage();
});

completedTasksList.addEventListener('click', function(event) {
    const target = event.target; 

    const returnToCurrentBtn = document.createElement('button');
    returnToCurrentBtn.innerHTML = 'Send to current';
    returnToCurrentBtn.classList.add('returnBtn');

    if (target.tagName === 'INPUT') {
        target.nextSibling.classList.remove("checked");
        
        completedTasksList.removeChild(target.parentElement.parentElement) && currentTasksList.appendChild(target.parentElement.parentElement);
        
        const indexOfTask = completedTasksArr.findIndex(i => i == target.parentElement.parentElement);
        const movableCheckedTask = completedTasksArr.splice(indexOfTask, 1)[0];
        currentTasksArr.splice(currentTasksArr.length, 1, movableCheckedTask);
        
    } else if(target.tagName === 'BUTTON') {
        
        completedTasksList.removeChild(target.parentElement) && deletedTasksList.appendChild(target.parentElement);
        
        const indexOfTask = completedTasksArr.findIndex(i => i == target.parentElement);
        const movableCheckedTask = completedTasksArr.splice(indexOfTask, 1)[0];
        deletedTasksArr.splice(deletedTasksArr.length, 1, movableCheckedTask);
        movableCheckedTask.firstChild.lastChild.classList.remove("checked");
        movableCheckedTask.firstChild.firstChild.remove();
        movableCheckedTask.appendChild(returnToCurrentBtn);
    } 
    saveListToStorage();
});

deletedTasksList.addEventListener('click', function(event) {
    const target = event.target; 
    
    if (target.tagName === 'INPUT' && target.type === 'checkbox') {
        target.nextSibling.classList.toggle("checked");
        
        deletedTasksList.removeChild(target.parentElement.parentElement) && currentTasksList.appendChild(target.parentElement.parentElement);
        
        const indexOfTask = deletedTasksArr.findIndex(i => i == target.parentElement.parentElement);
        const movableCheckedTask = deletedTasksArr.splice(indexOfTask, 1)[0];
        currentTasksArr.splice(currentTasksArr.length, 1, movableCheckedTask);
    } else if (target.classList === "delete-btn") {
        confirm("Delete the task forever?");

        deletedTasksList.removeChild(target.parentElement);
        const indexOfTask = deletedTasksArr.findIndex(i => i == target.parentElement);
        deletedTasksArr.splice(indexOfTask, 1);
    }

    saveListToStorage();
});

const CURRENT_TASKS_ARRAY_STRINGS_LOCAL_STORAGE_KEY = 'currentTasksArrayStrings';

function saveListToStorage() {
    const currentTasksArrayStrings = []; 
    currentTasksArr.forEach(task => { 
        currentTasksArrayStrings.push(task.outerHTML); 
    });
    
    localStorage.setItem(CURRENT_TASKS_ARRAY_STRINGS_LOCAL_STORAGE_KEY, JSON.stringify(currentTasksArrayStrings)); 

    const completedTasksArrayStrings = []; 
    completedTasksArr.forEach(task => { 
        completedTasksArrayStrings.push(task.outerHTML); 
    });
    localStorage.setItem('completedTasksArrayStrings', JSON.stringify(completedTasksArrayStrings)); 
    
    const deletedTasksArrayStrings = []; 
    deletedTasksArr.forEach(task => { 
        deletedTasksArrayStrings.push(task.outerHTML); 
    });
    localStorage.setItem('deletedTasksArrayStrings', JSON.stringify(deletedTasksArrayStrings));
}

function getListFromStorage() {
    const getCurrentTasks = JSON.parse(localStorage.getItem('currentTasksArrayStrings')) || [];
    getCurrentTasks.forEach(task => {
        currentTasksList.insertAdjacentHTML("beforeend", task);

        const temporaryTaskContainer = document.createElement('div');
        temporaryTaskContainer.innerHTML = task;
        currentTasksArr.push(temporaryTaskContainer.children[0]); 
    });

    const getCompletedTasks = JSON.parse(localStorage.getItem('completedTasksArrayStrings')) || [];
    getCompletedTasks.forEach(task => {
        completedTasksList.insertAdjacentHTML("beforeend", task);
        const isDOMNode = document.createElement('div');
        isDOMNode.innerHTML = task;
        completedTasksArr.push(isDOMNode.children[0]);
    })
    
    const getDeletedTasks = JSON.parse(localStorage.getItem('deletedTasksArrayStrings')) || [];
    getDeletedTasks.forEach(task => {
        deletedTasksList.insertAdjacentHTML("beforeend", task);
        const isDOMNode = document.createElement('div');
        isDOMNode.innerHTML = task;
        deletedTasksArr.push(isDOMNode.children[0]);
    });
} 

function clearAllCurrent(){
    if (confirm("Clear all?")) {
        currentTasksList.innerHTML = '';
        currentTasksArr = [];
    }
    
    saveListToStorage();
}

function clearAllCompleted(){
    if (confirm("Clear all?")) {
        completedTasksList.innerHTML = '';
        completedTasksArr = [];
    }
    
    saveListToStorage();
}

function clearAllDeleted(){
    if (confirm("Clear all?")) {
        deletedTasksList.innerHTML = '';
        deletedTasksArr = [];
    }
    
    saveListToStorage();
}