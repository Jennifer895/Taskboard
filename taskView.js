export class TaskView {

    constructor() {
        this.cardList = document.querySelector(".card-list");
        this.form = document.getElementById("taskForm");
        this.modal = document.getElementById("modalOverlay");

        this.btnNewTicket = document.getElementById("btnNewTicket");
        this.btnCloseModal = document.getElementById("btnCloseModal");

        this.searchInput = document.getElementById("ticketSearchInput");
        this.sortSelect = document.getElementById("sortSelect");
    }

    closeModal(){
        this.modal.style.display = "none";
        this.resetFormUI(); // Wichtig: Formular zurücksetzen beim Schließen
    }

    openModal(){
        this.modal.style.display = "flex";
    }

    renderTasks(tasks) {
        this.cardList.innerHTML = ""; // Liste leeren
        tasks.forEach(task => this.createTaskCard(task));
    }

    createTaskCard(task) {
        const card = document.createElement("article");
        card.classList.add("card");
        
        // CSS Klasse hinzufügen, wenn erledigt
        if (task.doneState) {
            card.classList.add("done");
        }

        card.dataset.id = task.id;
        
        // Mapping für schöne Anzeige der Priorität (high -> Hoch)
        const prioMap = { "high": "Hoch", "medium": "Mittel", "low": "Niedrig" };

        card.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div>Priorität: <strong>${prioMap[task.priority]}</strong></div>
            <p class="card-date">Datum: ${task.date}</p>
            <div> 
                <button type="button" class="btn btn-done">${task.doneState ? '↩️' : '✔️'}</button>
                <button type="button" class="btn btn-edit">✏️</button>
                <button type="button" class="btn btn-delete">🗑</button>
            </div>
        `;
        this.cardList.appendChild(card);
    }

    fillForm(task) {
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskDescription").value = task.description;
        document.getElementById("taskPriority").value = task.priority;
        
        document.querySelector("#modalWindow h2").textContent = "Aufgabe bearbeiten";
        document.querySelector("#taskForm button[type='submit']").textContent = "Änderungen speichern";
    }

    resetFormUI() {
        this.form.reset();
        document.querySelector("#modalWindow h2").textContent = "Aufgabe erstellen";
        document.querySelector("#taskForm button[type='submit']").textContent = "Aufgabe erstellen";
    }
}