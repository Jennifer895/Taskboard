document.addEventListener("DOMContentLoaded", function() {

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
    createTaskCard(newTask);
    modal.style.display = "none";
    form.reset();
});

function createTaskCard(task) {
    const cardList = document.getElementsByClassName("card-list")[0];
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <select class="PrioritySelect">
            <option value="high" ${task.priority === "high" ? "selected" : ""}>Hoch</option>
            <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Mittel</option>
            <option value="low" ${task.priority === "low" ? "selected" : ""}>Niedrig</option>
        </select>
        <p>Datum: ${task.date}</p>
        <div> 
            <button type="button" class="btn btn-done"><img src="logo.jpg" alt="erledigt" class="card-user" width="20px"></button>
            <button type="button" class="btn btn-edit"><img src="bearbeiten.jpeg" alt="erledigt" class="card-user" width="20px"></button>
        </div>
    `;

    cardList.appendChild(card);
}});