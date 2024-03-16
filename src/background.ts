import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";
import { convertToForgettableCallback, isURL } from "./utils";

verifyIncognitoAccess();

chrome.action.onClicked.addListener(convertToForgettableCallback(onActionClicked));

async function onActionClicked(tab: chrome.tabs.Tab): Promise<void> {
  console.log("onActionClicked", tab.url, tab.incognito);
  if (tab.url === undefined) {
    throw new Error("tab.url is undefined");
  }
  await createNewTabInOppositeMode(tab.url, tab.incognito);
  if (tab.id === undefined) {
    throw new Error("tab.id is undefined");
  }
  await chrome.tabs.remove(tab.id);
}

chrome.runtime.onInstalled.addListener(() => {
  initializeSortedWindows();
  createContextMenu("link");
  createContextMenu("page");
  createContextMenu("selection");
});

type WindowFocusInfo = {
  windowId: number;
  lastFocused: Date;
  incognito: boolean;
};

let sortedWindows: WindowFocusInfo[] = [];
const initializeSortedWindows = (): void => {
  chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
    sortedWindows = windows.map(getWindowFocusInfo);
    console.log("sortedWindows", sortedWindows);
  });
};

const createContextMenu = (actionType: "link" | "page" | "selection"): void => {
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

function getWindowFocusInfo(window: chrome.windows.Window): WindowFocusInfo {
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

async function onContextMenuItemClicked(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): Promise<void> {
  if (tab === undefined) {
    throw new Error("Context menu clicked with no active tab");
  }
  const url = getTargetUrl(info);
  const shouldCloseTab = info.menuItemId === "pageItem";
  await createNewTabInOppositeMode(url, tab.incognito);
  if (shouldCloseTab) {
    if (tab.id === undefined) {
      throw new Error("tab.id is undefined");
    }
    await chrome.tabs.remove(tab.id);
  }
}

function getTargetUrl(info: chrome.contextMenus.OnClickData): string {
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
      } else {
        // no need to encode?
        return "https://www.google.com/search?q=" + trimmedText;
      }
    }
    default:
      throw new Error(`Unknown context menu item ID: ${info.menuItemId}`);
  }
}

async function createNewTabInOppositeMode(url: string, incognito: boolean): Promise<void> {
  const targetWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito !== incognito);
  if (targetWindowInfo === undefined) {
    console.log("No target window found, creating new window.");
    await chrome.windows.create({
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
}
