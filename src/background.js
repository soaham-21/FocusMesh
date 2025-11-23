let activeTask = "";
let tabCognitiveTemp = {}; 


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.type === "SET_TASK") {
        activeTask = msg.task.toLowerCase();
        sendResponse({ success: true });
    }

    if(msg.type === "GROUP_TABS") {
        groupTabsByRelevance();
        sendResponse({ success: true });
    }

    if(msg.type === "GET_COG_TEMP") {
        const totalTemp = Object.values(tabCognitiveTemp).reduce((a,b)=>a+b,0);
        sendResponse({ cognitiveTemp: totalTemp });
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    runContentCheck(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status === "complete") runContentCheck(tabId);
});


function runContentCheck(tabId) {
    chrome.tabs.sendMessage(tabId, { type: "GET_TEXT" }, (response) => {
        if(chrome.runtime.lastError) return;
        const text = (response?.text || "").toLowerCase();
        checkTabRelevance(tabId, text);
    });
}

function checkTabRelevance(tabId, text) {
    if(!activeTask || !text) {
        clearBadge(tabId);
        tabCognitiveTemp[tabId] = 0;
        return;
    }

    const taskWords = activeTask.split(" ");
    const match = taskWords.some(word => text.includes(word));

    if(match) {
        clearBadge(tabId);
        tabCognitiveTemp[tabId] = Math.max((tabCognitiveTemp[tabId]||0) - 1, 0);
    } else {
        showRedBadge(tabId);
        tabCognitiveTemp[tabId] = (tabCognitiveTemp[tabId]||0) + 1;
    }

    console.log(`🔥 Cognitive Temperature [Tab ${tabId}]:`, tabCognitiveTemp[tabId]);
}

function showRedBadge(tabId) {
    chrome.action.setBadgeText({ text: "!", tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId });
}

function clearBadge(tabId) {
    chrome.action.setBadgeText({ text: "", tabId });
}

function groupTabsByRelevance() {
    chrome.tabs.query({}, (tabs) => {
        const relevantIds = [];
        const irrelevantIds = [];

        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_TEXT" }, (response) => {
                if(chrome.runtime.lastError) return;
                const text = (response?.text || "").toLowerCase();
                if(!activeTask) return;

                const match = activeTask.split(" ").some(w => text.includes(w));
                if(match) relevantIds.push(tab.id);
                else irrelevantIds.push(tab.id);

                
                if(relevantIds.length + irrelevantIds.length === tabs.length) {
                    if(relevantIds.length > 0) {
                        chrome.tabs.group({ tabIds: relevantIds }, (groupId) => {
                            chrome.tabGroups.update(groupId, { title: "Relevant", color: "green" });
                        });
                    }
                    if(irrelevantIds.length > 0) {
                        chrome.tabs.group({ tabIds: irrelevantIds }, (groupId) => {
                            chrome.tabGroups.update(groupId, { title: "Irrelevant", color: "red" });
                        });
                    }
                }
            });
        });
    });
}
function groupTabsByRelevance() {
    chrome.tabs.query({}, async (tabs) => {
        const relevantIds = [];
        const irrelevantIds = [];

        
        const promises = tabs.map(tab => new Promise(resolve => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_TEXT" }, (response) => {
                if (chrome.runtime.lastError) return resolve(); 
                const text = (response?.text || "").toLowerCase();
                if (!activeTask) return resolve();

                const match = activeTask.split(" ").some(w => text.includes(w));
                if(match) relevantIds.push(tab.id);
                else irrelevantIds.push(tab.id);
                resolve();
            });
        }));

        await Promise.all(promises);

        // Now group tabs
        if(relevantIds.length > 0){
            chrome.tabs.group({ tabIds: relevantIds }, (groupId) => {
                chrome.tabGroups.update(groupId, { title: "Relevant", color: "green" });
            });
        }
        if(irrelevantIds.length > 0){
            chrome.tabs.group({ tabIds: irrelevantIds }, (groupId) => {
                chrome.tabGroups.update(groupId, { title: "Irrelevant", color: "red" });
            });
        }
    });
}
