export class TaskView {

    constructor() {
        this.cardList = document.querySelector(".card-list");
        this.form = document.getElementById("taskForm");
        this.modal = document.getElementById("modalOverlay");
        this.searchInput = document.getElementById("ticketSearchInput");
       
        this.deleteBtn = document.getElementById("btnDeleteTask");
    
        this.sortSelect = document.getElementById("sortSelect");
    }

    renderTasks(tasks) {
        this.cardList.innerHTML = ""; // Liste leeren
        tasks.forEach(task => this.createTaskCard(task));
    }

    createTaskCard(task) {
    const cardList = document.getElementsByClassName("card-list")[0];
    const card = document.createElement("article");
    card.classList.add("card");
    card.dataset.id = task.id;
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
            <button type="button" class="btn btn-delete"><img src="loeschensymbol.png" alt="löschen" class="card-user" width="20px"></button>
        </div>
    `;
    cardList.appendChild(card);
}
fillForm(task) {
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskDescription").value = task.description;
        document.getElementById("taskPriority").value = task.priority; // Wichtig: Values müssen stimmen (high/medium/low)
        
        // Optik anpassen: Wir ändern die Überschrift und den Button-Text
        document.querySelector("#modalWindow h2").textContent = "Aufgabe bearbeiten";
        document.querySelector("#taskForm button[type='submit']").textContent = "Änderungen speichern";
    }
    // Erweiterung der reset Methode (oder beim Schließen aufrufen)
    resetFormUI() {
        this.form.reset();
        // Zurück zum Original-Text
        document.querySelector("#modalWindow h2").textContent = "Aufgabe erstellen";
        document.querySelector("#taskForm button[type='submit']").textContent = "Aufgabe erstellen";
    }
} /*Hinweis: Denk daran, resetFormUI() aufzurufen, wenn das Modal geschlossen wird (closeModal), damit beim nächsten Mal "Neu erstellen" wieder sauber aussieht.
Füge in closeModal() also hinzu:
code
JavaScript
closeModal() {
        this.modal.style.display = "none";
        this.resetFormUI(); // <--- WICHTIG!
    }
Schritt 3: Der Controller (Die Logik)
Das ist der wichtigste Teil. Wir brauchen eine "Merk-Variable" im Controller: this.currentEditId.
Ist sie null -> Wir erstellen neu.
Hat sie eine Zahl (z.B. 5) -> Wir bearbeiten Aufgabe 5.
A. Constructor anpassen:
code
JavaScript
constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // STATUS-VARIABLE: Hier merken wir uns die ID, wenn wir bearbeiten.
        // Ist sie null, bedeutet das "Neuerstellung".
        this.currentEditId = null; 

        // ... deine Event Listener ...
B. Event Listener für den Bearbeiten-Button (Stift) hinzufügen:
(Ähnlich wie beim Löschen, im gleichen click Listener auf cardList)
code
JavaScript
// --- Innerhalb von this.view.cardList.addEventListener("click", ...) ---
        
        // Prüfen: War es der Edit-Button?
        const editBtn = e.target.closest(".btn-edit");

        if (editBtn) {
            const card = editBtn.closest(".card");
            const taskId = parseInt(card.dataset.id); // ID auslesen

            // 1. Daten aus DB holen
            const task = await this.model.getTaskById(taskId);

            // 2. ID merken! Das ist der Schalter für später.
            this.currentEditId = taskId;

            // 3. Formular füllen und Modal öffnen
            this.view.fillForm(task);
            this.view.openModal();
        }
C. Die handleAddTask Methode (Submit) umbauen:
Hier entscheiden wir jetzt: Neu oder Update?
code
JavaScript
async handleAddTask(event) {
        event.preventDefault();

        // Daten aus Formular holen
        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const priority = document.getElementById("taskPriority").value;
        
        // Datum: Entweder wir behalten das alte (bei Edit) oder nehmen heute (bei Neu)
        // Einfachheitshalber nehmen wir hier immer das aktuelle Datum als "Zuletzt bearbeitet"
        const date = new Date().toLocaleDateString(); 

        const taskObj = {
            title: title,
            description: description,
            priority: priority,
            date: date,
            doneState: false // Könnte man auch auslesen, falls man Status behalten will
        };

        // --- ENTSCHEIDUNG: NEU ODER EDIT? ---

        if (this.currentEditId !== null) {
            // FALL: BEARBEITEN
            // Wir müssen die alte ID in das Objekt packen, damit die DB weiß, wen sie überschreiben soll.
            taskObj.id = this.currentEditId; 
            
            // WICHTIG: Status (doneState) vom alten Objekt behalten, sonst wird es als "unfertig" resettet
            // (Fortgeschritten: Man müsste vorher das alte Objekt laden oder den Status im Formular speichern)
            
            await this.model.updateTask(taskObj);
            console.log("Aufgabe aktualisiert:", taskObj);
        } else {
            // FALL: NEU ERSTELLEN
            // Keine ID mitgeben (macht die DB automatisch)
            await this.model.addTask(taskObj);
            console.log("Neue Aufgabe erstellt");
        }

        // Aufräumen
        this.currentEditId = null; // Wichtig: Resetten für das nächste Mal!
        
        this.view.closeModal();
        
        // Liste neu laden
        const tasks = await this.model.getAllTasks();
        this.view.renderTasks(tasks);
    }
Zusammenfassung
Klick auf Stift:
Controller holt die Daten der Aufgabe.
Controller setzt this.currentEditId = 5.
View füllt das Formular und ändert den Titel auf "Bearbeiten".
Modal öffnet sich.
Klick auf Speichern:
Controller sieht: this.currentEditId ist nicht leer.
Controller fügt id: 5 in das Objekt ein.
Controller ruft model.updateTask() auf (überschreibt Eintrag 5).
Controller setzt this.currentEditId wieder auf null.
Klick auf "Neues Ticket":
Controller hat this.currentEditId auf null (vom Constructor oder Reset).
View zeigt leeres Formular.
Speichern ruft model.addTask() auf (neuer Eintrag).
Damit hast du ein vollwertiges CRUD-System (Create, Read, Update, Delete) fertig! 🚀*/