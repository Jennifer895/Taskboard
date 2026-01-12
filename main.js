import { TaskView } from "./taskView";  
import { TaskModel } from "./taskModel";
import { TaskController } from "./taskControler";

// Initialisierung
const model = new TaskModel();
const view = new TaskView();
const controller = new TaskController(model, view);