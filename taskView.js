class TaskView {

    constructor() {
        this.cardList = document.querySelector(".card-list");
        this.form = document.getElementById("taskForm");
        this.modal = document.getElementById("modalOverlay");

        this.btnNewTicket = document.getElementById("btnNewTicket");
        this.btnCloseModal = document.getElementById("btnCloseModal");

        //test
        console.log("View wurde erstellt.");
        console.log("Habe ich den Button gefunden?", this.btnNewTicket);
        console.log("Habe ich das Modal gefunden?", this.modal);
    }

    closeModal(){
        this.modal.style.display = "none";
    }

    openModal(){
        this.modal.style.display = "flex";
    }

    renderTasks(tasks) {
        this.cardList.innerHTML = ""; // Liste leeren
        tasks.forEach(task => this.createTaskCard(task));
    }

    createTaskCard(task) {
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
}}