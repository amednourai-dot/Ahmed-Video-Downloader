const form = document.getElementById("download-form");
const urlInput = document.getElementById("video-url");
const pasteBtn = document.getElementById("paste-btn");
const message = document.getElementById("message");
const result = document.getElementById("result");
const resultText = document.getElementById("result-text");
const themeToggle = document.getElementById("theme-toggle");
const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-button");

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.toggle("active", page.id === pageId);
        page.scrollTop = 0;
    });

    navButtons.forEach(button => {
        const active = button.dataset.page === pageId;
        button.classList.toggle("active", active);
        button.setAttribute("aria-current", active ? "page" : "false");
    });

    history.replaceState(null, "", "#" + pageId);
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

document.querySelector(".logo").addEventListener("click", event => {
    event.preventDefault();
    showPage("home");
});

function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
    localStorage.setItem("ahmed-downloader-theme", theme);
}

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    applyTheme(isLight ? "dark" : "light");
});

applyTheme(localStorage.getItem("ahmed-downloader-theme") || "dark");

function showMessage(text, type = "normal") {
    message.textContent = text;
    message.style.color =
        type === "error" ? "#ff7777" :
        type === "success" ? "#40d6a0" :
        "var(--muted)";
}

function isTikTokUrl(value) {
    try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();

        const allowedHosts = [
            "tiktok.com",
            "www.tiktok.com",
            "m.tiktok.com",
            "vm.tiktok.com",
            "vt.tiktok.com"
        ];

        return url.protocol === "https:" && allowedHosts.includes(host);
    } catch {
        return false;
    }
}

pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();

        if (!text) {
            showMessage("الحافظة فارغة.", "error");
            return;
        }

        urlInput.value = text.trim();
        showMessage("تم لصق الرابط. اضغط تحليل الرابط.", "success");
    } catch {
        showMessage("تعذر اللصق تلقائيًا. الصق الرابط يدويًا.", "error");
    }
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const value = urlInput.value.trim();

    result.classList.add("hidden");
    resultText.textContent = "";

    if (!value) {
        showMessage("أدخل رابط الفيديو أولًا.", "error");
        return;
    }

    if (!isTikTokUrl(value)) {
        showMessage("الرابط غير صالح أو ليس من نطاقات TikTok المدعومة.", "error");
        return;
    }

    result.classList.remove("hidden");
    resultText.textContent =
        "تم التحقق الأولي من الرابط. التنزيل الفعلي غير متاح حتى ربط خدمة معالجة.";

    showMessage("تم التحقق من نطاق الرابط.", "success");
});

urlInput.addEventListener("input", () => {
    showMessage("اضغط تحليل الرابط للتحقق من العنوان.");
    result.classList.add("hidden");
});

function initializePage() {
    const requestedPage = location.hash.replace("#", "");
    const validPages = ["home", "guide", "about"];

    showPage(validPages.includes(requestedPage) ? requestedPage : "home");
}

initializePage();
