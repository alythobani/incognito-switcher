/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContextMenuTypeFromId = exports.setupContextMenus = void 0;
const contextMenu_1 = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
/* Exports */
function setupContextMenus() {
    chrome.runtime.onInstalled.addListener(createContextMenus);
    chrome.contextMenus.onClicked.addListener((0, utils_1.convertToForgettableCallback)(contextMenu_1.onContextMenuItemClicked));
}
exports.setupContextMenus = setupContextMenus;
function getContextMenuTypeFromId(contextMenuItemId) {
    var _a;
    const unexpectedMenuItemIdMsg = `Unexpected context menu item ID: ${contextMenuItemId}`;
    if (typeof contextMenuItemId !== "string") {
        throw new Error(unexpectedMenuItemIdMsg);
    }
    const contextTypeRegexStr = extensionContextMenuTypes.join("|");
    const contextMenuItemIdRegex = new RegExp(`^(?<contextMenuType>${contextTypeRegexStr})Item$`);
    const menuItemIdRegexMatch = contextMenuItemId.match(contextMenuItemIdRegex);
    if (menuItemIdRegexMatch === null) {
        throw new Error(unexpectedMenuItemIdMsg);
    }
    const contextMenuType = (_a = menuItemIdRegexMatch.groups) === null || _a === void 0 ? void 0 : _a.contextMenuType;
    if (contextMenuType === undefined) {
        throw new Error(unexpectedMenuItemIdMsg);
    }
    return contextMenuType;
}
exports.getContextMenuTypeFromId = getContextMenuTypeFromId;
const extensionContextMenuTypes = [
    "link",
    "page",
    "selection",
];
const createContextMenus = () => {
    createContextMenu("link");
    createContextMenu("page");
    createContextMenu("selection");
};
const createContextMenu = (contextMenuType) => {
    chrome.contextMenus.create({
        id: getContextMenuItemId(contextMenuType),
        title: chrome.i18n.getMessage(`${contextMenuType}ContextMenu`),
        contexts: [contextMenuType],
    });
};
const getContextMenuItemId = (contextMenuType) => {
    return `${contextMenuType}Item`;
};


/***/ }),
/* 2 */
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
exports.onContextMenuItemClicked = void 0;
const setupContextMenus_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(3);
const closeTab_1 = __webpack_require__(4);
const createNewTab_1 = __webpack_require__(5);
/* Exports */
function onContextMenuItemClicked(info, tab) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tab === undefined) {
            throw new Error("Context menu clicked with no active tab");
        }
        const url = getContextMenuTargetUrl(info);
        const isCurrentlyIncognito = tab.incognito;
        const newMode = (0, createNewTab_1.incognitoBooleanToMode)(!isCurrentlyIncognito);
        yield (0, createNewTab_1.createNewTab)({ url, mode: newMode });
        if (shouldCloseCurrentTab(info)) {
            yield (0, closeTab_1.closeTab)(tab);
        }
    });
}
exports.onContextMenuItemClicked = onContextMenuItemClicked;
/* Implementation */
const getContextMenuTargetUrl = (info) => {
    const contextMenuType = (0, setupContextMenus_1.getContextMenuTypeFromId)(info.menuItemId);
    switch (contextMenuType) {
        case "link":
            if (info.linkUrl === undefined) {
                throw new Error(`info.linkUrl is undefined: ${JSON.stringify(info)}`);
            }
            return info.linkUrl;
        case "page":
            return info.pageUrl;
        case "selection": {
            if (info.selectionText === undefined) {
                throw new Error(`info.selectionText is undefined: ${JSON.stringify(info)}`);
            }
            return getSelectionTextTargetUrl(info.selectionText);
        }
        default:
            (0, utils_1.throwExpectedNeverError)(contextMenuType);
    }
};
const getSelectionTextTargetUrl = (selectionText) => {
    const trimmedText = selectionText.trim();
    if ((0, utils_1.isURL)(trimmedText)) {
        return trimmedText;
    }
    const encodedText = encodeURIComponent(trimmedText);
    return "https://www.google.com/search?q=" + encodedText;
};
const shouldCloseCurrentTab = (info) => {
    const contextMenuType = (0, setupContextMenus_1.getContextMenuTypeFromId)(info.menuItemId);
    switch (contextMenuType) {
        case "link":
            return false;
        case "page":
            return true;
        case "selection":
            return false;
        default:
            (0, utils_1.throwExpectedNeverError)(contextMenuType);
    }
};


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throwExpectedNeverError = exports.isURL = exports.convertToForgettableCallback = void 0;
function convertToForgettableCallback(promiseFunction) {
    return (...args) => {
        void promiseFunction(...args);
    };
}
exports.convertToForgettableCallback = convertToForgettableCallback;
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
exports.isURL = isURL;
function throwExpectedNeverError(value) {
    throw new Error("Expected never, instead got: " + JSON.stringify(value));
}
exports.throwExpectedNeverError = throwExpectedNeverError;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports) {


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
exports.closeTab = void 0;
function closeTab(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tab.id === undefined) {
            throw new Error(`tab.id is undefined: ${JSON.stringify(tab)}`);
        }
        yield chrome.tabs.remove(tab.id);
    });
}
exports.closeTab = closeTab;


/***/ }),
/* 5 */
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
exports.createNewTab = exports.incognitoBooleanToMode = void 0;
const sortedWindows_1 = __webpack_require__(6);
/* Exports */
function incognitoBooleanToMode(incognito) {
    return incognito ? "incognito" : "normal";
}
exports.incognitoBooleanToMode = incognitoBooleanToMode;
function createNewTab(_a) {
    return __awaiter(this, arguments, void 0, function* ({ url, mode }) {
        const incognito = modeToIncognitoBoolean(mode);
        const sortedWindows = yield (0, sortedWindows_1.getSortedWindows)();
        const targetWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito === incognito);
        if (targetWindowInfo === undefined) {
            // TODO - re-query chrome windows and try again
            console.log("No target window found, creating new window.");
            yield chrome.windows.create({ url, incognito });
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
exports.createNewTab = createNewTab;
const modeToIncognitoBoolean = (mode) => mode === "incognito";


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports) {


/* Exports */
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
exports.setSortedWindows = exports.getSortedWindows = void 0;
function getSortedWindows() {
    return __awaiter(this, void 0, void 0, function* () {
        const sortedWindowsProvider = yield SortedWindowsProvider.getInstance();
        return sortedWindowsProvider.getSortedWindows();
    });
}
exports.getSortedWindows = getSortedWindows;
function setSortedWindows(sortedWindows) {
    return __awaiter(this, void 0, void 0, function* () {
        const sortedWindowsProvider = yield SortedWindowsProvider.getInstance();
        sortedWindowsProvider.setSortedWindows(sortedWindows);
    });
}
exports.setSortedWindows = setSortedWindows;
/* Implementation */
class SortedWindowsProvider {
    constructor(sortedWindows) {
        this.sortedWindows = sortedWindows;
        this.listenForWindowChanges();
    }
    listenForWindowChanges() {
        this.listenForWindowCreation();
        this.listenForWindowRemoval();
        this.listenForWindowFocusChange();
    }
    listenForWindowCreation() {
        chrome.windows.onCreated.addListener((window) => {
            this.sortedWindows.push(getNewWindowFocusInfo(window));
        });
    }
    listenForWindowRemoval() {
        chrome.windows.onRemoved.addListener((windowId) => {
            this.sortedWindows = this.sortedWindows.filter((window) => window.windowId !== windowId);
        });
    }
    listenForWindowFocusChange() {
        chrome.windows.onFocusChanged.addListener((windowId) => {
            if (windowId === chrome.windows.WINDOW_ID_NONE) {
                return;
            }
            for (const windowInfo of this.sortedWindows) {
                if (windowInfo.windowId === windowId) {
                    windowInfo.lastFocused = new Date();
                    break;
                }
            }
            // TODO: Handle focused window not found in sortedWindows (add it)
            this.sortWindows();
        });
    }
    sortWindows() {
        this.sortedWindows.sort((a, b) => b.lastFocused.valueOf() - a.lastFocused.valueOf());
    }
    /* Exposed methods */
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (SortedWindowsProvider.instance === null) {
                const sortedWindows = yield initializeSortedWindows();
                SortedWindowsProvider.instance = new SortedWindowsProvider(sortedWindows);
            }
            return SortedWindowsProvider.instance;
        });
    }
    getSortedWindows() {
        return this.sortedWindows;
    }
    setSortedWindows(sortedWindows) {
        this.sortedWindows = sortedWindows;
    }
}
/* Private fields and methods */
SortedWindowsProvider.instance = null;
const initializeSortedWindows = () => __awaiter(void 0, void 0, void 0, function* () {
    let sortedWindows = [];
    const allWindows = yield queryWindows();
    sortedWindows = allWindows.map(getNewWindowFocusInfo);
    return sortedWindows;
});
const queryWindows = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve) => {
        chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
            resolve(windows);
        });
    });
});
const getNewWindowFocusInfo = (window) => {
    if (window.id === undefined) {
        throw new Error("window.id is undefined");
    }
    return {
        windowId: window.id,
        lastFocused: new Date(),
        incognito: window.incognito,
    };
};


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupMainAction = void 0;
const mainAction_1 = __webpack_require__(8);
const utils_1 = __webpack_require__(3);
function setupMainAction() {
    chrome.action.onClicked.addListener((0, utils_1.convertToForgettableCallback)(mainAction_1.onMainAction));
}
exports.setupMainAction = setupMainAction;


/***/ }),
/* 8 */
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
exports.onMainAction = void 0;
const closeTab_1 = __webpack_require__(4);
const createNewTab_1 = __webpack_require__(5);
const onMainAction = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("onMainAction", tab.url, tab.incognito);
    if (tab.url === undefined) {
        throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
    }
    const isCurrentlyIncognito = tab.incognito;
    const newMode = (0, createNewTab_1.incognitoBooleanToMode)(!isCurrentlyIncognito);
    yield (0, createNewTab_1.createNewTab)({ url: tab.url, mode: newMode });
    yield (0, closeTab_1.closeTab)(tab);
});
exports.onMainAction = onMainAction;


/***/ }),
/* 9 */
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const setupContextMenus_1 = __webpack_require__(1);
const setupMainAction_1 = __webpack_require__(7);
const verifyIncognitoAccess_1 = __webpack_require__(9);
(0, verifyIncognitoAccess_1.verifyIncognitoAccess)();
(0, setupMainAction_1.setupMainAction)();
(0, setupContextMenus_1.setupContextMenus)();

})();

/******/ })()
;