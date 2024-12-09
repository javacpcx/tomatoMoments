class FamousQuotes {
    constructor() {
        this.quotes = [];
        this.initQuotes();        
    }

    // 初始化名言數據
    async initQuotes() {
        const storedQuotes = await this.getStoredQuotes();
        if (storedQuotes) {
            // 如果 localStorage 中已有數據，直接加載
            this.quotes = storedQuotes;
        } else {
            // 否則從 JSON 文件中加載初始數據
            await this.loadQuotesFromFile();
            this.saveQuotesToStorage(); // 保存到 localStorage
        }
    }

    // 從 localStorage 獲取名言
    async getStoredQuotes() {
        return new Promise((resolve) => {
            chrome.storage.local.get("famousQuotes", (result) => {
                resolve(result.famousQuotes || null);
            });
        });
    }

    // 從 JSON 文件加載名言
    async loadQuotesFromFile() {
        try {
            const response = await fetch(chrome.runtime.getURL("famous_quotes.json"));
            if (!response.ok) throw new Error("無法加載 famous_quotes.json");
            this.quotes = await response.json();
        } catch (error) {
            console.error("名言數據加載失敗：", error);
        }
    }

    // 保存名言到 localStorage
    saveQuotesToStorage() {
        chrome.storage.local.set({ famousQuotes: this.quotes }, () => {
            console.log("名言佳句已保存到 storage。");
        });
    }

    // 隨機顯示名言
    displayRandomQuote() {
        if (this.quotes.length === 0) {
            alert("名言數據尚未加載，請稍候重試。");
            return;
        }
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const { quote, author } = this.quotes[randomIndex];
        const quoteDisplay = document.getElementById("quote-display");
        
        quoteDisplay.innerHTML = `"${quote}" <br> — <strong>${author}</strong>`;
    }
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
    const famousQuotes = new FamousQuotes();

    // 綁定隨機顯示名言按鈕
    document.getElementById("random-quote-button").addEventListener("click", () => {
        famousQuotes.displayRandomQuote();
    });
});
