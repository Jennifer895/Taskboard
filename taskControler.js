export class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;


        // Event-Listener binden
        this.view.form.addEventListener("submit", (e) => this.handleAddTask(e));
        this.view.searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));

// Methode fürs löschen noch auslagern!!!
        this.view.cardList.addEventListener("click", async (e) => {
            if (e.target.closest(".btn-delete")) {
                if (deleteBtn) {
                // 2. Die Karte finden, zu der dieser Button gehört
                const card = deleteBtn.closest(".card");
                
                // 3. Die ID aus dem HTML lesen (dataset.id ist immer text, daher parseInt)
                const taskId = parseInt(card.dataset.id);

                // 4. Sicherheitsabfrage (Popup)
                const bestätigung = confirm("Möchtest du diese Aufgabe wirklich löschen?");

                if (bestätigung) {
                    // 5. Model anweisen zu löschen
                    await this.model.deleteTask(taskId);

                    // 6. Liste neu laden, damit die Karte verschwindet
                    const updatedTasks = await this.model.getAllTasks();
                    this.view.renderTasks(updatedTasks);
                }
            }
        }

        // --- Sortierung --- noch auslagern!!
        // Das Event "change" feuert, wenn man eine neue Option im Dropdown auswählt
        this.view.sortSelect.addEventListener("change", (e) => {
            const sortierKriterium = e.target.value;
            this.handleSort(sortierKriterium);
        });
    }

    /*
    async init() {
        await this.model.init();
        const tasks = await this.model.getAllTasks();
        this.view.renderTasks(tasks);
    }

    async handleAddTask(event) {
        event.preventDefault();
        const newTask = {
            title: document.getElementById("taskTitle").value,
            description: document.getElementById("taskDescription").value,
            // ... Restliche Daten
        };
        await this.model.addTask(newTask);
        this.view.renderTasks(await this.model.getAllTasks());
    }
 */
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

        // 2. Sortieren je nach Auswahl
        // Die .sort() Funktion erwartet einen Vergleich von zwei Elementen (a und b).
        // Wenn das Ergebnis negativ ist, kommt a vor b.
        // Wenn positiv, kommt b vor a.

        switch (kriterium) {
            case "titel":
                // Alphabetisch sortieren (A-Z)
                tasks.sort((a, b) => a.title.localeCompare(b.title));
                break;

            case "priorität":
                // Hier brauchen wir einen Trick: Wir geben den Wörtern Zahlenwerte!
                const prioWerte = { "high": 3, "medium": 2, "low": 1 };
                
                // Wir sortieren absteigend (Höchste Zahl zuerst)
                tasks.sort((a, b) => prioWerte[b.priority] - prioWerte[a.priority]);
                break;

            case "status":
                // Erledigte nach unten (false = 0, true = 1)
                tasks.sort((a, b) => a.doneState - b.doneState);
                break;

            case "datum":
                // Da dein Datum aktuell ein String ist ("dd.mm.yyyy"), ist Sortieren schwer.
                // TRICK: Da die ID automatisch hochzählt, ist eine höhere ID 
                // normalerweise auch ein neueres Datum. Wir sortieren nach ID absteigend (neueste zuerst).
                tasks.sort((a, b) => b.id - a.id);
                break;
        }

        // 3. Die neu sortierte Liste anzeigen
        this.view.renderTasks(tasks);
    }
}
    