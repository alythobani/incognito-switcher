/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
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
exports.getLastFocusedWindowIdOfMode = exports.getSortedWindows = exports.startSortedWindowsInstance = void 0;
const createNewTab_1 = __webpack_require__(2);
/* Exports */
function startSortedWindowsInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        yield SortedWindowsProvider.getInstance();
    });
}
exports.startSortedWindowsInstance = startSortedWindowsInstance;
function getSortedWindows() {
    return __awaiter(this, void 0, void 0, function* () {
        const sortedWindowsProvider = yield SortedWindowsProvider.getInstance();
        return sortedWindowsProvider.getSortedWindows();
    });
}
exports.getSortedWindows = getSortedWindows;
function getLastFocusedWindowIdOfMode(mode) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const incognito = (0, createNewTab_1.modeToIncognitoBoolean)(mode);
        const sortedWindows = yield getSortedWindows();
        const lastFocusedWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito === incognito);
        return (_a = lastFocusedWindowInfo === null || lastFocusedWindowInfo === void 0 ? void 0 : lastFocusedWindowInfo.windowId) !== null && _a !== void 0 ? _a : null;
    });
}
exports.getLastFocusedWindowIdOfMode = getLastFocusedWindowIdOfMode;
/* Provider Class */
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
            this.sortedWindows.unshift(getNewWindowFocusInfo(window));
        });
    }
    listenForWindowRemoval() {
        chrome.windows.onRemoved.addListener((windowId) => {
            this.sortedWindows = this.sortedWindows.filter((window) => window.windowId !== windowId);
        });
    }
    listenForWindowFocusChange() {
        chrome.windows.onFocusChanged.addListener((windowId) => {
            void onWindowFocus({ windowId, sortedWindowsProvider: this });
        });
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
    sortWindows() {
        this.sortedWindows.sort((a, b) => b.lastFocused.valueOf() - a.lastFocused.valueOf());
    }
}
/* Private fields and methods */
SortedWindowsProvider.instance = null;
/* Implementation */
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
const onWindowFocus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ windowId, sortedWindowsProvider, }) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
    }
    const sortedWindows = sortedWindowsProvider.getSortedWindows();
    const windowFocusInfo = sortedWindows.find((windowInfo) => windowInfo.windowId === windowId);
    if (windowFocusInfo === undefined) {
        throw new Error(`Window from onFocusChanged not found: ${windowId}`);
    }
    windowFocusInfo.lastFocused = new Date();
    sortedWindowsProvider.sortWindows();
});


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
exports.createNewTab = exports.incognitoBooleanToMode = exports.modeToIncognitoBoolean = void 0;
const sortedWindows_1 = __webpack_require__(1);
const chromeUtils_1 = __webpack_require__(3);
function modeToIncognitoBoolean(mode) {
    return mode === "incognito";
}
exports.modeToIncognitoBoolean = modeToIncognitoBoolean;
function incognitoBooleanToMode(incognito) {
    return incognito ? "incognito" : "normal";
}
exports.incognitoBooleanToMode = incognitoBooleanToMode;
/**
 * Creates a new tab in the last focused window of the given mode. Creates a new window if no window of the given mode exists.
 * @returns Whether the tab was successfully created
 */
function createNewTab(_a) {
    return __awaiter(this, arguments, void 0, function* ({ url, mode }) {
        if ((0, chromeUtils_1.isInvalidChromeUrl)(url) && mode === "incognito") {
            console.warn("Cannot open chrome:// URL in incognito mode: " + url);
            return false;
        }
        const lastFocusedWindowId = yield (0, sortedWindows_1.getLastFocusedWindowIdOfMode)(mode);
        if (lastFocusedWindowId === null) {
            console.log("No target window found, creating new window.");
            yield chrome.windows.create({ url, incognito: modeToIncognitoBoolean(mode) });
            return true;
        }
        const newlyFocusedWindow = yield chrome.windows.update(lastFocusedWindowId, { focused: true });
        yield chrome.tabs.create({
            windowId: newlyFocusedWindow.id,
            url,
            active: true,
        });
        return true;
    });
}
exports.createNewTab = createNewTab;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExtensionSettingsURL = exports.isInvalidChromeUrl = void 0;
function isInvalidChromeUrl(url) {
    return url.startsWith("chrome://") && !url.startsWith("chrome://newtab/");
}
exports.isInvalidChromeUrl = isInvalidChromeUrl;
function getExtensionSettingsURL() {
    return `chrome://extensions/?id=${chrome.runtime.id}`;
}
exports.getExtensionSettingsURL = getExtensionSettingsURL;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContextMenuTypeFromId = exports.setupContextMenus = void 0;
const contextMenu_1 = __webpack_require__(5);
const utils_1 = __webpack_require__(6);
/* Exports */
function setupContextMenus() {
    chrome.runtime.onInstalled.addListener(createContextMenus);
    chrome.contextMenus.onClicked.addListener((0, utils_1.convertToCallback)(contextMenu_1.onContextMenuItemClicked));
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
exports.onContextMenuItemClicked = void 0;
const setupContextMenus_1 = __webpack_require__(4);
const utils_1 = __webpack_require__(6);
const closeTab_1 = __webpack_require__(7);
const createNewTab_1 = __webpack_require__(2);
/* Exports */
function onContextMenuItemClicked(info, tab) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tab === undefined) {
            throw new Error("Context menu clicked with no active tab");
        }
        const url = getContextMenuTargetUrl(info);
        const isCurrentlyIncognito = tab.incognito;
        const newMode = (0, createNewTab_1.incognitoBooleanToMode)(!isCurrentlyIncognito);
        const didCreateTab = yield (0, createNewTab_1.createNewTab)({ url, mode: newMode });
        if (didCreateTab && shouldCloseCurrentTab(info)) {
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
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throwExpectedNeverError = exports.isURL = exports.convertToCallback = void 0;
function convertToCallback(promiseFunction) {
    return (...args) => {
        void promiseFunction(...args);
    };
}
exports.convertToCallback = convertToCallback;
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
/* 7 */
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
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupCommands = void 0;
const mainCommand_1 = __webpack_require__(9);
function setupCommands() {
    chrome.commands.onCommand.addListener((command, tab) => {
        switch (command) {
            case "mainCommand":
                void (0, mainCommand_1.onMainCommand)(tab);
                break;
            default:
                console.error("Unknown command", command);
        }
    });
}
exports.setupCommands = setupCommands;


/***/ }),
/* 9 */
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
exports.onMainCommand = void 0;
const switchTabToOppositeMode_1 = __webpack_require__(10);
function onMainCommand(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("onMainCommand", tab, tab.url, tab.incognito);
        yield (0, switchTabToOppositeMode_1.switchTabToOppositeMode)(tab);
    });
}
exports.onMainCommand = onMainCommand;


/***/ }),
/* 10 */
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
exports.switchTabToOppositeMode = void 0;
const closeTab_1 = __webpack_require__(7);
const createNewTab_1 = __webpack_require__(2);
const switchTabToOppositeMode = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("switchTabToOppositeMode", tab.url, tab.incognito);
    if (tab.url === undefined) {
        throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
    }
    const isCurrentlyIncognito = tab.incognito;
    const newMode = (0, createNewTab_1.incognitoBooleanToMode)(!isCurrentlyIncognito);
    const didCreateTab = yield (0, createNewTab_1.createNewTab)({ url: tab.url, mode: newMode });
    if (didCreateTab) {
        yield (0, closeTab_1.closeTab)(tab);
    }
});
exports.switchTabToOppositeMode = switchTabToOppositeMode;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupMainAction = void 0;
const mainAction_1 = __webpack_require__(12);
const utils_1 = __webpack_require__(6);
function setupMainAction() {
    chrome.action.onClicked.addListener((0, utils_1.convertToCallback)(mainAction_1.onMainAction));
}
exports.setupMainAction = setupMainAction;


/***/ }),
/* 12 */
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
const chromeUtils_1 = __webpack_require__(3);
const createNewTab_1 = __webpack_require__(2);
const onMainAction = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("onMainAction", tab, tab.url, tab.incognito);
    yield (0, createNewTab_1.createNewTab)({ url: (0, chromeUtils_1.getExtensionSettingsURL)(), mode: "normal" });
});
exports.onMainAction = onMainAction;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyIncognitoAccess = void 0;
const chromeUtils_1 = __webpack_require__(3);
const verifyIncognitoAccess = () => {
    chrome.extension.isAllowedIncognitoAccess((isAllowedAccess) => {
        if (isAllowedAccess) {
            return;
        }
        const message = "Please enable incognito access for Incognito Switcher to work properly. Click here to adjust the settings.";
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icon/icon.png",
            title: "Enable Incognito Access",
            message,
        }, (notificationId) => {
            chrome.notifications.onClicked.addListener((clickedNotificationId) => {
                if (clickedNotificationId === notificationId) {
                    void chrome.tabs.create({ url: (0, chromeUtils_1.getExtensionSettingsURL)() });
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
const sortedWindows_1 = __webpack_require__(1);
const setupContextMenus_1 = __webpack_require__(4);
const setupCommands_1 = __webpack_require__(8);
const setupMainAction_1 = __webpack_require__(11);
const verifyIncognitoAccess_1 = __webpack_require__(13);
void (0, sortedWindows_1.startSortedWindowsInstance)();
(0, verifyIncognitoAccess_1.verifyIncognitoAccess)();
(0, setupMainAction_1.setupMainAction)();
(0, setupCommands_1.setupCommands)();
(0, setupContextMenus_1.setupContextMenus)();

})();

/******/ })()
;