"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.action.onClicked.addListener(onActionClicked);
chrome.extension.isAllowedIncognitoAccess((isAllowedAccess) => {
    if (isAllowedAccess) {
        return;
    }
    const enableAccessLink = `chrome://extensions/?id=${chrome.runtime.id}`;
    const message = "Please enable incognito access for Incognito Switcher to work properly. Click here to adjust the settings.";
    chrome.notifications.create({
        type: "basic",
        iconUrl: "../icon/icon.png",
        title: "Enable Incognito Access",
        message: message,
    }, (notificationId) => {
        chrome.notifications.onClicked.addListener((clickedNotificationId) => {
            if (clickedNotificationId === notificationId) {
                chrome.tabs.create({ url: enableAccessLink });
                chrome.notifications.clear(notificationId);
            }
        });
    });
});
function onActionClicked(tab) {
    console.log("onActionClicked", tab.url, tab.incognito);
    if (!tab.url) {
        throw new Error("tab.url is undefined");
    }
    createNewTabInOppositeMode(tab.url, tab.incognito);
    if (!tab.id) {
        throw new Error("tab.id is undefined");
    }
    chrome.tabs.remove(tab.id);
}
chrome.runtime.onInstalled.addListener(() => {
    initializeSortedWindows();
    createContextMenu("link");
    createContextMenu("page");
    createContextMenu("selection");
});
let sortedWindows = [];
const initializeSortedWindows = () => {
    chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
        sortedWindows = windows.map(getWindowFocusInfo);
        console.log("sortedWindows", sortedWindows);
    });
};
const createContextMenu = (actionType) => {
    chrome.contextMenus.create({
        id: `${actionType}Item`,
        title: chrome.i18n.getMessage(`${actionType}ContextMenu`),
        contexts: [actionType],
    });
};
chrome.windows.onCreated.addListener(function (window) {
    const newWindowInfo = getWindowFocusInfo(window);
    sortedWindows.push(newWindowInfo);
});
function getWindowFocusInfo(window) {
    if (!window.id) {
        throw new Error("window.id is undefined");
    }
    return {
        windowId: window.id,
        lastFocused: new Date(),
        incognito: window.incognito,
    };
}
chrome.windows.onRemoved.addListener(function (windowId) {
    sortedWindows = sortedWindows.filter((window) => window.windowId !== windowId);
});
chrome.windows.onFocusChanged.addListener(function (windowId) {
    console.log("Focus changed: " + windowId);
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
    }
    for (const windowInfo of sortedWindows) {
        if (windowInfo.windowId === windowId) {
            windowInfo.lastFocused = new Date();
            break;
        }
    }
    sortedWindows.sort((a, b) => b.lastFocused.valueOf() - a.lastFocused.valueOf());
});
chrome.contextMenus.onClicked.addListener((info, tab) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tab) {
        throw new Error("Context menu clicked with no active tab");
    }
    let link;
    let removeTab = false;
    switch (info.menuItemId) {
        case "linkItem":
            link = info.linkUrl;
            break;
        case "pageItem":
            link = info.pageUrl;
            removeTab = true;
            break;
        case "selectionItem":
            if (!info.selectionText) {
                return;
            }
            let text = info.selectionText.trim();
            if (isURL(text)) {
                link = text;
            }
            else {
                // no need to encode?
                link = "https://www.google.com/search?q=" + text;
            }
            break;
    }
    if (link) {
        createNewTabInOppositeMode(link, tab.incognito);
    }
    if (removeTab) {
        if (!tab.id) {
            throw new Error("tab.id is undefined");
        }
        chrome.tabs.remove(tab.id);
    }
}));
function createNewTabInOppositeMode(url, incognito) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito !== incognito);
        if (targetWindowInfo === undefined) {
            console.log("No target window found, creating new window.");
            yield chrome.windows.create({
                url: url,
                incognito: !incognito,
            });
            return;
        }
        chrome.windows.update(targetWindowInfo.windowId, { focused: true }, (focusedWindow) => {
            chrome.tabs.create({
                windowId: focusedWindow.id,
                url: url,
                active: true,
            });
        });
    });
}
function isURL(text) {
    let url;
    try {
        url = new URL(text);
    }
    catch (e) {
        return false;
    }
    return true;
}
