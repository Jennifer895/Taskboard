export class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // STATUS-VARIABLE: ID merken beim Bearbeiten (null = neu)
        this.currentEditId = null;

        // Event-Listener initialisieren
        this.initEventListeners();
    }

    initEventListeners() {
        // 1. Formular Submit (Erstellen oder Update)
        this.view.form.addEventListener("submit", (e) => this.handleFormSubmit(e));

        // 2. Modal Öffnen/Schließen
        this.view.btnNewTicket.addEventListener("click", () => {
            this.currentEditId = null; // Sicherstellen, dass wir im "Neu"-Modus sind
            this.view.resetFormUI();
            this.view.openModal();
        });

        this.view.btnCloseModal.addEventListener("click", () => {
            this.view.closeModal();
        });

        // 3. Suche
        this.view.searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));

        // 4. Sortierung
        this.view.sortSelect.addEventListener("change", (e) => this.handleSort(e.target.value));

        // 5. Buttons auf den Karten (Löschen / Bearbeiten / Erledigt)
        // Wir nutzen "Event Delegation" auf der Liste, statt Listener auf jeden Button zu setzen
        this.view.cardList.addEventListener("click", (e) => this.handleCardClick(e));
    }

    async init() {
        try {
            await this.model.init();
            console.log("DB initialisiert");
            const tasks = await this.model.getAllTasks();
            this.view.renderTasks(tasks);
        } catch (error) {
            console.error(error);
        }
    }

    // --- LOGIK ---

    async handleFormSubmit(event) {
        event.preventDefault();

        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const priority = document.getElementById("taskPriority").value;
        
        // Datum hier noch nicht setzen, hängt davon ab, ob neu oder edit
        let date = new Date().toLocaleDateString();
        let doneState = false;

        if (this.currentEditId !== null) {
            // UPDATE FALL: Alte Daten holen, um Datum und Status zu retten
            const oldTask = await this.model.getTaskById(this.currentEditId);
            
            // Behalte das ursprüngliche Datum und den Status bei!
            date = oldTask.date; 
            doneState = oldTask.doneState;

            const taskObj = {
                id: this.currentEditId,
                title: title,
                description: description,
                priority: priority,
                date: date,
                doneState: doneState
            };
            
            await this.model.updateTask(taskObj);
        } else {
            // NEU ERSTELLEN FALL
            const taskObj = {
                title: title,
                description: description,
                priority: priority,
                date: date, // Neues Datum
                doneState: false // Neuer Status
            };
            await this.model.addTask(taskObj);
        }

        this.currentEditId = null;
        this.view.closeModal();
        
        const tasks = await this.model.getAllTasks();
        this.view.renderTasks(tasks);
    }

    async handleCardClick(e) {
        // A. LÖSCHEN
        const deleteBtn = e.target.closest(".btn-delete");
        if (deleteBtn) {
            const card = deleteBtn.closest(".card");
            const taskId = parseInt(card.dataset.id);
            if(confirm("Wirklich löschen?")) {
                await this.model.deleteTask(taskId);
                const tasks = await this.model.getAllTasks();
                this.view.renderTasks(tasks);
            }
            return;
        }

        // B. BEARBEITEN
        const editBtn = e.target.closest(".btn-edit");
        if (editBtn) {
            const card = editBtn.closest(".card");
            const taskId = parseInt(card.dataset.id);

            const task = await this.model.getTaskById(taskId);
            
            this.currentEditId = taskId; // WICHTIG: Modus auf "Bearbeiten" setzen
            this.view.fillForm(task);
            this.view.openModal();
            return;
        }
        
        // C. ERLEDIGT 
         const doneBtn = e.target.closest(".btn-done");
        if (doneBtn) {
            const card = doneBtn.closest(".card");
            const taskId = parseInt(card.dataset.id);
            
            // Task holen, Status toggeln, speichern
            const task = await this.model.getTaskById(taskId);
            task.doneState = !task.doneState; // True zu False und umgekehrt
            
            await this.model.updateTask(task);
            
            // Ansicht aktualisieren
            const tasks = await this.model.getAllTasks();
            this.view.renderTasks(tasks);
            return;
        }
    }

    async handleSearch(searchTerm) {
        const tasks = await this.model.getAllTasks();
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.view.renderTasks(filteredTasks);
    }

    async handleSort(kriterium) {
        let tasks = await this.model.getAllTasks();

        switch (kriterium) {
            case "titel":
                tasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "priorität":
                const prioWerte = { "high": 3, "medium": 2, "low": 1 };
                tasks.sort((a, b) => prioWerte[b.priority] - prioWerte[a.priority]);
                break;
            case "datum":
                // Sortierung nach ID (da ID chronologisch aufsteigend ist)
                tasks.sort((a, b) => b.id - a.id);
                break;
            case "status":
                // Erledigte nach unten (oder oben, je nach Wunsch)
                tasks.sort((a, b) => Number(a.doneState) - Number(b.doneState));
                break;
        }
        this.view.renderTasks(tasks);
    }
}