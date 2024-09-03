// Selektovanje elemenata
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModal = document.querySelector('.close');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const taskIdInput = document.getElementById('taskId');

let tasks = [];

// Otvaranje modal prozora za dodavanje zadatka
addTaskBtn.addEventListener('click', () => {
    openModal();
});

// Zatvaranje modal prozora
closeModal.addEventListener('click', () => {
    closeTaskModal();
});

// Klik van modal prozora zatvara modal
window.addEventListener('click', (e) => {
    if (e.target == taskModal) {
        closeTaskModal();
    }
});

// Obrada submit događaja forme
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const id = taskIdInput.value;

    if (id) {
        // Uređivanje postojećeg zadatka
        tasks = tasks.map(task => task.id === id ? { ...task, title, description, status } : task);
    } else {
        // Dodavanje novog zadatka
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            status
        };
        tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    closeTaskModal();
});

// Funkcija za otvaranje modal prozora
function openModal(task = null) {
    taskModal.style.display = 'block';
    if (task) {
        modalTitle.textContent = 'Uredi Zadatak';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskStatus').value = task.status;
        taskIdInput.value = task.id;
    } else {
        modalTitle.textContent = 'Dodaj Zadatak';
        taskForm.reset();
        taskIdInput.value = '';
    }
}

// Funkcija za zatvaranje modal prozora
function closeTaskModal() {
    taskModal.style.display = 'none';
}

// Funkcija za renderovanje zadataka na tabli
function renderTasks() {
    const statuses = ['todo', 'in-progress', 'done'];
    statuses.forEach(status => {
        const taskList = document.getElementById(status);
        taskList.innerHTML = '';
        tasks.filter(task => task.status === status)
             .forEach(task => {
                const taskCard = createTaskCard(task);
                taskList.appendChild(taskCard);
             });
    });
}

// Funkcija za kreiranje HTML elementa zadatka
function createTaskCard(task) {
    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');
    div.dataset.id = task.id;

    const title = document.createElement('h3');
    title.textContent = task.title;

    const desc = document.createElement('p');
    desc.textContent = task.description;

    const actions = document.createElement('div');
    actions.classList.add('actions');

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openModal(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(title);
    div.appendChild(desc);
    div.appendChild(actions);

    // Dodavanje drag-and-drop događaja
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    return div;
}

// Funkcija za brisanje zadatka
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Čuvanje zadataka u localStorage
function saveTasks() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

// Učitavanje zadataka iz localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('kanbanTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Drag and Drop funkcionalnosti
let draggedTask = null;

function handleDragStart(e) {
    draggedTask = this;
    this.classList.add('dragging');
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedTask = null;
}

// Dodavanje događaja na kolone za drop
const columns = document.querySelectorAll('.task-list');
columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
});

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (draggedTask) {
        const newStatus = this.parentElement.dataset.status;
        const taskId = draggedTask.dataset.id;
        tasks = tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task);
        saveTasks();
        renderTasks();
    }
}

// Inicijalizacija aplikacije
loadTasks();
renderTasks();
