class ToDoList {
    constructor(taskListElement, pomodoroCountElement) {
        this.taskListElement = taskListElement; // HTML UL 元素
        this.pomodoroCountElement = pomodoroCountElement; // 番茄數量顯示元素
        this.tasks = [];
        this.pomodoroCount = 0;
        this.loadTasks(); // 從本地儲存載入
    }

    // 新增任務
    addTask(taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task);
    }

    // 標記任務為完成
    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.completed = true;
            this.pomodoroCount++;
            this.updatePomodoroCount();
            this.saveTasks();
            this.renderTasks(); // 重新渲染列表
        }
    }

    // 刪除任務
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    // 更新番茄數量
    updatePomodoroCount() {
        this.pomodoroCountElement.textContent = this.pomodoroCount;
    }

    // 儲存任務到本地存儲
    saveTasks() {
        const data = {
            tasks: this.tasks,
            pomodoroCount: this.pomodoroCount
        };
        localStorage.setItem("todoListData", JSON.stringify(data));
    }

    // 從本地儲存載入任務
    loadTasks() {
        const data = JSON.parse(localStorage.getItem("todoListData")) || {
            tasks: [],
            pomodoroCount: 0
        };
        this.tasks = data.tasks;
        this.pomodoroCount = data.pomodoroCount;
        this.updatePomodoroCount();
        this.renderTasks();
    }

    // 渲染任務列表
    renderTasks() {
        this.taskListElement.innerHTML = "";
        this.tasks.forEach(task => this.renderTask(task));
    }

    // 渲染單個任務
    renderTask(task) {
        const taskItem = document.createElement("li");
        taskItem.className = task.completed ? "completed" : "";
        taskItem.innerHTML = `
        ${task.text}
        <div class="task-actions">
          <button class="complete-task-button btn-warning btn-sm">完成</button>
          <button class="delete-task-button btn-danger btn-sm">刪除</button>
        </div>
      `;
        this.taskListElement.appendChild(taskItem);

        // 綁定按鈕事件
        taskItem.querySelector(".complete-task-button").addEventListener("click", () => {
            this.completeTask(task.id);
        });
        taskItem.querySelector(".delete-task-button").addEventListener("click", () => {
            this.deleteTask(task.id);
        });
    }

    // 自動完成第一個未完成的任務
    autoCompleteFirstTask() {
        const firstTask = this.tasks.find(task => !task.completed);
        if (firstTask) {
            this.completeTask(firstTask.id);
        }
    }
}
