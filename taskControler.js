class TaskController {
    constructor(model, view) {
        //test
         console.log("Controller: Ich lebe! Verbinde jetzt die Buttons..."); 
         
        this.model = model;
        this.view = view;

        // Event-Listener binden
        this.view.form.addEventListener("submit", (e) => this.handleAddTask(e));

        // Wrapper sorgt dafür das handleAddTask() vorgehalten aber nicht direckt beim scriptladen ausgeführt wird
       //  Wrapper-Funktion (e) das Event vom Browser geliefert.
        //      Und sie reicht es weiter an this.handleAddTask(e)
       //  this.view.btnNewTicket.addEventListener("click", this.view.openModal());

        this.view.btnNewTicket.addEventListener("click", () => {
            this.view.openModal();
        });

        this.view.btnCloseModal.addEventListener("click", () => {
            this.view.closeModal();
        });
    }

    
    async init() {
        await this.model.init();
        const tasks = await this.model.getAllTasks();
        this.view.renderTasks(tasks);
    }

    async handleAddTask(event) {
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
        
        await this.model.addTask(newTask);
        this.view.renderTasks(await this.model.getAllTasks());
        const tasks = await this.model.getAllTasks();
        this.view.renderTasks(tasks);
        this.view.closeModal();
        this.view.form.reset();
    }}