chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_TEXT") {
        sendResponse({ text: document.body.innerText || "" });
    }

    if (msg.type === "SHOW_OVERLAY") {
        showOverlay();
    }
});

function showOverlay() {
    if (document.getElementById("focusmesh-overlay")) return;

    const div = document.createElement("div");
    div.id = "focusmesh-overlay";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.backgroundColor = "rgba(255,0,0,0.2)";
    div.style.zIndex = "9999";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.fontSize = "30px";
    div.style.color = "#FF0000";
    div.innerText = "⚠ FocusMesh: You are spiraling!";

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}
