class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Event-Listener binden
        this.view.form.addEventListener("submit", (e) => this.handleAddTask(e));
    }
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
}
    */