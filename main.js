import { TaskModel } from "./taskModel.js";
import { TaskView } from "./taskView.js";
import { TaskController } from "./taskController.js"; 


document.addEventListener("DOMContentLoaded", () => {
    const model = new TaskModel();
    const view = new TaskView();
    const controller = new TaskController(model, view);

    controller.init();
});

