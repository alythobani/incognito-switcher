/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const verifyIncognitoAccess_1 = __webpack_require__(1);
function convertToForgettableCallback(promiseFunction) {
    return (...args) => {
        void promiseFunction(...args);
    };
}
(0, verifyIncognitoAccess_1.verifyIncognitoAccess)();
chrome.action.onClicked.addListener(convertToForgettableCallback(onActionClicked));
function onActionClicked(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("onActionClicked", tab.url, tab.incognito);
        if (tab.url === undefined) {
            throw new Error("tab.url is undefined");
        }
        yield createNewTabInOppositeMode(tab.url, tab.incognito);
        if (tab.id === undefined) {
            throw new Error("tab.id is undefined");
        }
        yield chrome.tabs.remove(tab.id);
    });
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
    if (window.id === undefined) {
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
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
    }
    console.log("Focus changed: " + windowId);
    for (const windowInfo of sortedWindows) {
        if (windowInfo.windowId === windowId) {
            windowInfo.lastFocused = new Date();
            break;
        }
    }
    sortedWindows.sort((a, b) => b.lastFocused.valueOf() - a.lastFocused.valueOf());
    console.log(`sortedWindows: ${JSON.stringify(sortedWindows.map((w) => w.windowId))}`);
});
chrome.contextMenus.onClicked.addListener(convertToForgettableCallback(onContextMenuItemClicked));
function onContextMenuItemClicked(info, tab) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tab === undefined) {
            throw new Error("Context menu clicked with no active tab");
        }
        const url = getTargetUrl(info);
        const shouldCloseTab = info.menuItemId === "pageItem";
        yield createNewTabInOppositeMode(url, tab.incognito);
        if (shouldCloseTab) {
            if (tab.id === undefined) {
                throw new Error("tab.id is undefined");
            }
            yield chrome.tabs.remove(tab.id);
        }
    });
}
function getTargetUrl(info) {
    switch (info.menuItemId) {
        case "linkItem":
            if (info.linkUrl === undefined) {
                throw new Error("info.linkUrl is undefined");
            }
            return info.linkUrl;
        case "pageItem":
            return info.pageUrl;
        case "selectionItem": {
            if (info.selectionText === undefined) {
                throw new Error("info.selectionText is undefined");
            }
            const trimmedText = info.selectionText.trim();
            if (isURL(trimmedText)) {
                return trimmedText;
            }
            else {
                // no need to encode?
                return "https://www.google.com/search?q=" + trimmedText;
            }
        }
        default:
            throw new Error(`Unknown context menu item ID: ${info.menuItemId}`);
    }
}
function createNewTabInOppositeMode(url, incognito) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito !== incognito);
        if (targetWindowInfo === undefined) {
            console.log("No target window found, creating new window.");
            yield chrome.windows.create({
                url,
                incognito: !incognito,
            });
            return;
        }
        chrome.windows.update(targetWindowInfo.windowId, { focused: true }, (focusedWindow) => {
            void chrome.tabs.create({
                windowId: focusedWindow.id,
                url,
                active: true,
            });
        });
    });
}
function isURL(text) {
    let url;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        url = new URL(text);
    }
    catch (e) {
        return false;
    }
    return true;
}


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyIncognitoAccess = void 0;
const verifyIncognitoAccess = () => {
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
            message,
        }, (notificationId) => {
            chrome.notifications.onClicked.addListener((clickedNotificationId) => {
                if (clickedNotificationId === notificationId) {
                    void chrome.tabs.create({ url: enableAccessLink });
                    chrome.notifications.clear(notificationId);
                }
            });
        });
    });
};
exports.verifyIncognitoAccess = verifyIncognitoAccess;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;