document.getElementById("setTaskBtn").addEventListener("click", () => {
    const task = document.getElementById("taskInput").value;
    chrome.runtime.sendMessage({ type: "SET_TASK", task }, (res) => {
        if(res.success) alert("Task set!");
    });
});

document.getElementById("groupTabsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "GROUP_TABS" }, (res) => {
        if(res.success) alert("Tabs grouped!");
    });
});


function updateCognitiveTemp() {
    chrome.runtime.sendMessage({ type: "GET_COG_TEMP" }, (res) => {
        if(res?.cognitiveTemp !== undefined) {
            document.getElementById("cogTemp").innerText = res.cognitiveTemp;
        }
    });
}
setInterval(updateCognitiveTemp, 1000);
