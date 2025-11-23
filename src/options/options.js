
chrome.storage.local.get(["threshold", "negativeWords"], (res) => {
    document.getElementById("thresholdInput").value = res.threshold || 10;
    document.getElementById("negativeWordsInput").value = res.negativeWords || "stress,fail,panic";
});

document.getElementById("saveBtn").addEventListener("click", () => {
    const threshold = parseInt(document.getElementById("thresholdInput").value);
    const negativeWords = document.getElementById("negativeWordsInput").value;
    chrome.storage.local.set({ threshold, negativeWords }, () => alert("Settings saved!"));
});

document.getElementById("resetBtn").addEventListener("click", () => {
    chrome.storage.local.remove("activeTask", () => alert("Active task reset!"));
});
