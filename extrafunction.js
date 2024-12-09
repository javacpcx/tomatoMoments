class ExtraFunctions {
    constructor() {
        this.points = 0; // 初始化積分
        this.loadPoints(); // 從本地存儲載入積分
    }

    // 健康提醒
    showHealthReminder() {
        const reminders = [
            "站起來伸展一下！",
            "喝杯水，保持健康！",
            "閉上眼睛休息 30 秒！",
            "鍥而捨之，朽木不折；鍥而不捨，金石可鏤。",
            "時間不會給你任何機會，改變才有機會。",
            "深呼吸幾次，放鬆身心！"
        ];
        const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
        alert(randomReminder);
    }

    // 同步到 Google 日曆
    syncGoogleCalendar(tasks, pomodoroCount) {
        // 確保 Google API 已初始化
        /* if (!gapi.auth2) {
            alert("Google 授權模組未初始化！");
            return;
        }
 */
        // 首先進行授權檢查
/*         gapi.auth2
            .getAuthInstance()
            .signIn()
            .then(() => {
                console.log("授權成功！");
                // 構建 Google 日曆事件數據
                const events = tasks
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

                // 插入每個事件到 Google 日曆
                events.forEach((event) => {
                    gapi.client.calendar.events
                        .insert({
                            calendarId: "primary",
                            resource: event,
                        })
                        .then((response) => {
                            console.log("事件已同步到 Google 日曆", response);
                        })
                        .catch((err) => {
                            console.error("無法同步到 Google 日曆", err);
                            alert(`同步失敗：${err.result.error.message}`);
                        });
                });

                alert("已成功同步到 Google 日曆！");
            })
            .catch((err) => {
                console.error("授權失敗：", err);
                alert("請重新授權訪問 Google 日曆！");
            });
 */    }



    // 載入積分（範例功能）
    loadPoints() {
        const storedPoints = parseInt(localStorage.getItem("userPoints"), 10);
        if (!isNaN(storedPoints)) {
            this.points = storedPoints;
        }
        this.displayPoints();
    }

    // 顯示積分（範例功能）
    displayPoints() {
        const pointsElement = document.getElementById("points-display");
        if (pointsElement) {
            pointsElement.textContent = `積分：${this.points}`;
        }
    }
}

// 動態加載 Google API 客戶端庫
function loadGoogleApi() {
    return new Promise((resolve, reject) => {
        /* if (typeof gapi !== "undefined") return resolve(); // 如果已加載，直接返回
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Google API 加載失敗！"));
        document.head.appendChild(script); */
    });
}

function initGoogleAPI() {
    return new Promise((resolve, reject) => {
       /*  gapi.load("client:auth2", () => {
            gapi.client
                .init({
                    apiKey: "test",
                    clientId: "823877254385-sad4cdfc2ae6qjpfki47tjvan462kb2l.apps.googleusercontent.com",
                    scope: "https://www.googleapis.com/auth/calendar.events",
                })
                .then(() => {
                    console.log("Google API 初始化成功！");
                    resolve();
                })
                .catch((err) => {
                    console.error("Google API 初始化失敗：", err);
                    reject(err);
                });
        }); */
    });
}


// DOM 加載後初始化
document.addEventListener("DOMContentLoaded", () => {
    initGoogleAPI();
});



