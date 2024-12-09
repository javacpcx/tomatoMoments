class QuoteManager {
    constructor() {
        this.quotes = [];
        this.loadQuotes();
        this.setupEventListeners();
    }

    // 從 localStorage 加載名言
    async loadQuotes() {
        this.quotes = await this.getStoredQuotes();
        this.renderQuotes();
    }

    // 從 localStorage 獲取名言
    async getStoredQuotes() {
        return new Promise((resolve) => {
            chrome.storage.local.get("famousQuotes", (result) => {
                resolve(result.famousQuotes || []);
            });
        });
    }

    // 保存名言到 localStorage
    saveQuotes() {
        chrome.storage.local.set({ famousQuotes: this.quotes }, () => {
            console.log("名言佳句已保存到 localStorage。");
            this.renderQuotes();
        });
    }

    // 渲染名言列表（使用表格）
    renderQuotes() {
        const quoteList = document.getElementById("quote-list");
        quoteList.innerHTML = "";
        this.quotes.forEach((quote, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${quote.quote}</td>
                <td>${quote.author}</td>
                <td>
                    <button data-index="${index}" class="btn btn-danger btn-sm delete-quote">刪除</button>
                    <button data-index="${index}" class="btn btn-primary btn-sm edit-quote">編輯</button>
                </td>
            `;
            quoteList.appendChild(row);
        });
    }

    // 新增名言
    addQuote(quote, author) {
        this.quotes.push({ quote, author });
        this.saveQuotes();
    }

    // 刪除名言
    deleteQuote(index) {
        this.quotes.splice(index, 1);
        this.saveQuotes();
    }

    // 編輯名言
    editQuote(index, updatedQuote, updatedAuthor) {
        this.quotes[index] = { quote: updatedQuote, author: updatedAuthor };
        this.saveQuotes();
    }

    // 保存為 JSON
    saveJSON() {
        const blob = new Blob([JSON.stringify(this.quotes, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "famous_quotes.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    // 載入 JSON
    loadJSON(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    if (Array.isArray(data)) {
                        this.quotes = data;
                        this.saveQuotes();
                        alert("名言佳句已成功載入！");
                    } else {
                        alert("JSON 格式錯誤！");
                    }
                } catch (error) {
                    alert("無法解析 JSON 文件！");
                    console.error("JSON 解析失敗：", error);
                }
            };
            reader.readAsText(file);
        } else {
            alert("請選擇有效的 JSON 文件！");
        }
    }

    // 綁定事件
    setupEventListeners() {
        document.getElementById("add-quote-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const quote = document.getElementById("new-quote").value.trim();
            const author = document.getElementById("new-author").value.trim();
            if (!quote || !author) {
                alert("請填寫完整的名言和作者！");
                return;
            }
            this.addQuote(quote, author);
            event.target.reset();
        });

        document.getElementById("quote-list").addEventListener("click", (event) => {
            const index = parseInt(event.target.dataset.index, 10);
            if (event.target.classList.contains("delete-quote")) {
                this.deleteQuote(index);
            } else if (event.target.classList.contains("edit-quote")) {
                const updatedQuote = prompt("輸入新的名言：", this.quotes[index].quote);
                const updatedAuthor = prompt("輸入新的作者：", this.quotes[index].author);
                if (updatedQuote && updatedAuthor) {
                    this.editQuote(index, updatedQuote, updatedAuthor);
                }
            }
        });

        document.getElementById("save-json-button").addEventListener("click", () => {
            this.saveJSON();
        });

        document.getElementById("load-json-button").addEventListener("change", (event) => {
            this.loadJSON(event);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new QuoteManager();
});
