document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value;
        const priority = parseInt(priorityInput.value, 10);
        addTask(task, priority);
        addTime(priority);  // Add time based on priority input
        taskInput.value = '';
        priorityInput.value = '3';  // Reset to default priority
    });

    function addTask(task, priority) {
        const taskItem = document.createElement('li');
        taskItem.dataset.priority = priority;
        taskItem.dataset.time = priority * 3600; // Store the time in seconds
        taskItem.innerHTML = `
            <span>${task}</span>
            <button onclick="removeTask(this)">Remove</button>
        `;
        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            if (taskItem.classList.contains('completed')) {
                reduceTime(parseInt(taskItem.dataset.time, 10));
            } else {
                addTime(parseInt(taskItem.dataset.priority, 10));
            }
        });

        let inserted = false;
        for (let i = 0; i < taskList.children.length; i++) {
            if (taskList.children[i].dataset.priority > priority) {
                taskList.insertBefore(taskItem, taskList.children[i]);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            taskList.appendChild(taskItem);
        }
    }
});

function removeTask(button) {
    const taskItem = button.parentElement;
    if (!taskItem.classList.contains('completed')) {
        // If the task is not completed, reduce the time accordingly before removing
        reduceTime(parseInt(taskItem.dataset.time, 10));
    }
    taskItem.remove();
}

let interval;
let remainingSeconds = 0;

function addTime(priority) {
    const secondsToAdd = priority * 3600;
    remainingSeconds += secondsToAdd;

    if (!interval) {
        startTimer();
    } else {
        updateTimerDisplay();
    }
}

function reduceTime(secondsToReduce) {
    remainingSeconds = Math.max(0, remainingSeconds - secondsToReduce);
    updateTimerDisplay();
}

function startTimer() {
    interval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(interval);
            interval = null;
            alert('Time is up!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    document.getElementById('timer-display').innerText =
        `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
    return time.toString().padStart(2, '0');
}
