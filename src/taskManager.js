export let activeTask = "";

export function setTask(task) {
    activeTask = task.toLowerCase();
    chrome.storage.local.set({ activeTask });
}

export function getTask(callback) {
    chrome.storage.local.get(["activeTask"], result => {
        callback(result.activeTask || "");
    });
}
