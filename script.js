const form = document.getElementById("download-form");
const urlInput = document.getElementById("video-url");
const pasteBtn = document.getElementById("paste-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const message = document.getElementById("message");
const result = document.getElementById("result");
const resultText = document.getElementById("result-text");

function showMessage(text, type = "normal") {
message.textContent = text;
message.style.color =
type === "error" ? "#ff7777" :
type === "success" ? "#40d6a0" :
"#a7aec5";
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

    return (
        url.protocol === "https:" &&
        allowedHosts.includes(host)
    );
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
    showMessage("تم لصق النص. اضغط تحليل الرابط للتحقق منه.", "success");
} catch {
    showMessage(
        "تعذر الوصول إلى الحافظة. الصق الرابط يدويًا في المربع.",
        "error"
    );
}

});

form.addEventListener("submit", (event) => {
event.preventDefault();

const value = urlInput.value.trim();

result.classList.add("hidden");
resultText.textContent = "";

if (!value) {
    showMessage("أدخل رابط الفيديو أولًا.", "error");
    urlInput.focus();
    return;
}

if (!isTikTokUrl(value)) {
    showMessage(
        "الرابط غير صالح أو ليس من نطاقات TikTok المدعومة.",
        "error"
    );
    return;
}

result.classList.remove("hidden");
resultText.textContent =
    "الرابط اجتاز الفحص الأولي. لم يتم تنزيل الفيديو بعد؛ سنربط خدمة المعالجة في المرحلة التالية.";

showMessage("تم التحقق الأولي من نطاق الرابط.", "success");

});

urlInput.addEventListener("input", () => {
showMessage("اضغط تحليل الرابط للتحقق من العنوان.");
result.classList.add("hidden");
});
