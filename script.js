const btnNewTicket = document.getElementById("btnNewTicket");
const modal = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("closeModal");


btnNewTicket.onclick = function() {
    modal.style.display = "block";  }

closeBtn.onclick = function() {
    modal.style.display = "none";  }

let taskList = [];
const form = document.getElementById("taskForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const priority = document.getElementById("taskPriority").value;
    const date = new Date().toLocaleDateString();

    const newTask = {
        title: title,
        description: description,
        priority: priority,
        date: date,
        doneState: false
    };
    taskList.push(newTask);
    console.log(taskList);
    modal.style.display = "none";
    form.reset();
});

function createTaskCard(task) {