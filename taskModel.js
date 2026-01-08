class TaskModel {
    constructor() {
        this.dbName = "TaskBoardDB";
        this.dbVersion = 1;
        this.db = null; // Hier speichern wir später die Datenbank-Verbindung
    }

    /**
     * Initialisiert die Datenbank.
     * @returns {Promise} Löst auf, wenn die DB bereit ist.
     */
    init() {
        return new Promise((resolve, reject) => {
            // 1. Verbindung öffnen
            const request = indexedDB.open(this.dbName, this.dbVersion);

            // 2. Fehlerbehandlung
            request.onerror = (event) => {
                console.error("Datenbankfehler:", event.target.error);
                reject("Datenbank konnte nicht geöffnet werden");
            };

            // 3. Erfolg: Datenbank ist bereit
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            // 4. Struktur-Update (nur beim ersten Mal oder Versionssprung)
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Erstellt einen "Object Store" (wie eine Tabelle) namens "tasks"
                // 'id' ist der eindeutige Schlüssel und wird automatisch hochgezählt
                if (!db.objectStoreNames.contains("tasks")) {
                    db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
                }
            };
        });
    }
}