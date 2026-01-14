// taskModel.js
export class TaskModel {
    constructor() {
        this.dbName = "TaskBoardDB";
        this.dbVersion = 1;
        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("Datenbankfehler:", event.target.error);
                reject("Datenbank konnte nicht geöffnet werden");
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("tasks")) {
                    db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
                }
            };
        });
    }

    addTask(task) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tasks"], "readwrite");
            const store = transaction.objectStore("tasks");
            const request = store.add(task);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Fehler beim Speichern");
        });
    }

    getAllTasks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tasks"], "readonly");
            const store = transaction.objectStore("tasks");
            const request = store.getAll();

            // KORREKTUR: onsuccess muss HIER drin sein
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Fehler beim Laden der Aufgaben");
        });
    }

    deleteTask(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tasks"], "readwrite");
            const store = transaction.objectStore("tasks");
            // id muss eine Zahl sein!
            const request = store.delete(Number(id)); 

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject("Fehler beim Löschen");
        });
    }

    getTaskById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tasks"], "readonly");
            const store = transaction.objectStore("tasks");
            const request = store.get(Number(id));

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Fehler beim Laden");
        });
    }

    updateTask(task) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tasks"], "readwrite");
            const store = transaction.objectStore("tasks");
            const request = store.put(task);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject("Fehler beim Update");
        });
    }
}