document.addEventListener("DOMContentLoaded", () => {
   
    const appModel = new TaskModel();
    const appView = new TaskView();
    const appController = new TaskController(appModel, appView);

    appController.init();
});