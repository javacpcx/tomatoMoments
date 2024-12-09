// background.js

//importScripts("https://apis.google.com/js/api.js");

let gapiLoaded = false;

// 動態加載 Google API 客戶端庫
function loadGoogleApi() {
    /* if (gapiLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
            gapiLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error("Failed to load Google API"));
        document.head.appendChild(script);
    }); */
}

// 初始化 Google API
/* function initGoogleAPI() {
    return loadGoogleApi().then(() => {
        return gapi.load("client:auth2", () => {
            gapi.client.init({
                apiKey: "AIzaSyA0_Wmxv5ea-jDGTT73fefyv67eg1-r35U",
                clientId: "823877254385-sad4cdfc2ae6qjpfki47tjvan462kb2l.apps.googleusercontent.com",
                scope: "https://www.googleapis.com/auth/calendar.events",
            }).then(() => {
                console.log("Google API 初始化成功！");
            }).catch((err) => {
                console.error("Google API 初始化失敗：", err);
            });
        });
    });
} */

// 同步事件到 Google 日曆
function syncToGoogleCalendar(events) {
    /* return initGoogleAPI().then(() => {
        return Promise.all(
            events.map((event) =>
                gapi.client.calendar.events.insert({
                    calendarId: "primary",
                    resource: event,
                })
            )
        );
    }); */
}

// 處理來自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SYNC_CALENDAR") {
        syncToGoogleCalendar(message.events)
            .then(() => sendResponse({ success: true }))
            .catch((error) => sendResponse({ success: false, error: error.message }));
        return true; // 表示響應是異步的
    }
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
});

/* chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: screen.availWidth,
      height: screen.availHeight,
      left: 0,
      top: 0
    });
  }); */
  

/* chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),  // 指定HTML文件的URL
        type: "popup",                             // 使用 popup 類型
        state: "fullscreen"                        // 設置為全螢幕模式
    });
}); */