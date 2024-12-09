// 初始化 To-Do List
const taskListElement = document.getElementById("task-list");
const pomodoroCountElement = document.getElementById("pomodoro-count");
const todoList = new ToDoList(taskListElement, pomodoroCountElement);

document.getElementById('manage-quote-button').addEventListener('click', () => {
    window.open('manage_quotes.html', '_blank');
});


// 初始化創新功能
const extraFunctions = new ExtraFunctions();

// DOM 元素
const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const break5Button = document.getElementById("break-5-button");
const break15Button = document.getElementById("break-15-button");
const customMinutesInput = document.getElementById("custom-minutes");
const customStartButton = document.getElementById("custom-start-button");
const todoTaskInput = document.getElementById("todo-task");
const addTaskButton = document.getElementById("add-task-button");
const themeSelector = document.getElementById("theme-selector");
const soundSelector = document.getElementById("sound-selector");
const backgroundAudio = document.getElementById("background-audio");
const progressCircle = document.querySelector(".progress-ring__circle");
// 綁定同步到日曆按鈕事件
const syncCalendarButton = document.getElementById("sync-calendar-button");

syncCalendarButton.addEventListener("click", () => {
    const tasks = todoList.tasks; // 獲取所有任務
    const pomodoroCount = todoList.pomodoroCount; // 獲取完成的番茄鐘數量
    const extraFunctions = new ExtraFunctions();

    extraFunctions.syncGoogleCalendar(tasks, pomodoroCount); // 調用同步功能
});

// 計時完成時播放音樂
function playReminderSound() {
    const audio = document.getElementById("timer-audio");
    if (audio) {
        audio.play().catch((err) => console.error("播放音頻失敗：", err));
    } else {
        console.error("找不到音頻元件！");
    }
}


// 收集任務並構建 Google 日曆事件數據
/* function buildCalendarEvents(tasks, pomodoroCount) {
    return tasks
        .filter((task) => task.completed)
        .map((task) => ({
            summary: task.text,
            description: `完成了 ${pomodoroCount} 個番茄鐘`,
            start: {
                dateTime: new Date().toISOString(),
                timeZone: "Asia/Taipei",
            },
            end: {
                dateTime: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
                timeZone: "Asia/Taipei",
            },
        }));
} */

// 點擊同步按鈕時發送消息給背景頁面
/* document.getElementById("sync-calendar-button").addEventListener("click", () => {
    const tasks = todoList.tasks; // 獲取所有任務
    const pomodoroCount = todoList.pomodoroCount; // 獲取完成的番茄鐘數量
    //const events = buildCalendarEvents(tasks, pomodoroCount);    
    const extraFunctions = new ExtraFunctions();
    extraFunctions.syncGoogleCalendar(tasks, pomodoroCount); // 調用同步功能

    chrome.runtime.sendMessage(
        { type: "SYNC_CALENDAR", events: events },
        (response) => {
            if (response.success) {
                alert("已成功同步到 Google 日曆！");
            } else {
                alert("同步失敗：" + response.error);
            }
        }
    );
}); */



let timerDuration = 25 * 60; // 預設 25 分鐘
let timer = null; // 計時器
let remainingTime = timerDuration;



// 設定圓形進度條的參數
const radius = 220; // 圓形半徑
const circumference = 2 * Math.PI * radius; // 圓周長
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

// 格式化時間
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// 更新進度條動畫
function updateProgress() {
    const progress = remainingTime / timerDuration;
    const offset = circumference * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;
}

// 更新顯示
function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingTime);
    updateProgress();
}

// 啟動計時器
function startTimer() {
    if (timer) return; // 防止重複啟動計時器

    timer = setInterval(() => {
        remainingTime--;
        updateDisplay();

        if (remainingTime <= 0) {
            clearInterval(timer);
            timer = null;
            for (let s = 0; s < 10; s++) {
                showFireworks(); // 播放煙火動畫
            }            
            playReminderSound();
            todoList.autoCompleteFirstTask(); // 自動完成第一個未完成的任務            
        }
    }, 1000);
}

// 播放煙火動畫
function showFireworks() {
    const container = document.getElementById("fireworksContainer");

    if (!container) {
        console.error("找不到 fireworksContainer 元素！");
        return;
    }

    // 顯示煙火容器
    container.style.display = "block";

    // 隨機生成多個煙火
    for (let i = 0; i < 20; i++) {
        createFirework(container);
    }

    // 設置 3 秒後自動隱藏
    setTimeout(() => {
        container.style.display = "none";
        container.innerHTML = ""; // 清空內容
    }, 15000);
}

function createFirework(container) {
    const firework = document.createElement("div");
    firework.classList.add("firework");

    // 隨機位置和顏色
    firework.style.top = `${Math.random() * 100}%`;
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.backgroundColor = getRandomColor();

    container.appendChild(firework);
}

function getRandomColor() {
    const colors = ["#ff0000", "#ff9900", "#00ff00", "#0099ff", "#ff66ff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 更新主題
function updateTheme() {
    document.body.className = themeSelector.value;
}

// 更新背景聲音
function updateSound() {
    const soundMap = {
        "none": "",
        "white-noise": "white-noise.mp3",
        "white-noise-birdsong": "white-noise-birdsong.mp3",
        "birdsong": "birdsongFavor.mp3",
        "bell": "wind-bell.mp3",
        "water": "raining.mp3",
        "mountainsguqin": "mountainsguqin.mp3"
    };
    backgroundAudio.src = soundMap[soundSelector.value] || "";
    if (soundSelector.value !== "none") {
        backgroundAudio.play();
    } else {
        backgroundAudio.pause();
    }
}

// 重置計時器
function resetTimer() {
    clearInterval(timer);
    timer = null;
    remainingTime = timerDuration;
    updateDisplay();
}

// 設定休息時間
function setBreakTime(minutes) {
    clearInterval(timer);
    timer = null;
    timerDuration = minutes * 60;
    remainingTime = timerDuration;
    updateDisplay();
    startTimer();
}

// 設定自定義時間並啟動計時
function startCustomTimer() {
    const customMinutes = parseInt(customMinutesInput.value, 10);
    if (isNaN(customMinutes) || customMinutes <= 0) {
        alert("請輸入有效的分鐘數！");
        return;
    }

    clearInterval(timer);
    timer = null;
    timerDuration = customMinutes * 60;
    remainingTime = timerDuration;
    updateDisplay();
    startTimer();
}

// 綁定新增任務按鈕事件
addTaskButton.addEventListener("click", () => {
    const taskText = todoTaskInput.value.trim(); // 獲取輸入框內容
    if (taskText) {
        todoList.addTask(taskText); // 調用 ToDoList 的 addTask 方法
        todoTaskInput.value = ""; // 清空輸入框
    } else {
        alert("請輸入任務內容！");
    }
});

// 綁定按鈕事件
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
break5Button.addEventListener("click", () => setBreakTime(5)); // 5 分鐘休息
break15Button.addEventListener("click", () => setBreakTime(15)); // 15 分鐘休息
customStartButton.addEventListener("click", startCustomTimer); // 自定義計時
themeSelector.addEventListener("change", updateTheme); // 更新主題
soundSelector.addEventListener("change", updateSound); // 更新背景聲音

// 健康提醒功能按鈕
document.getElementById("health-reminder-button").addEventListener("click", () => {
    extraFunctions.showHealthReminder(); // 顯示隨機健康建議
});

// 初始更新
updateDisplay();
updateTheme();
updateSound();
