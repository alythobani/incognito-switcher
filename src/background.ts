chrome.action.onClicked.addListener(onActionClicked);

chrome.extension.isAllowedIncognitoAccess((isAllowedAccess) => {
  if (isAllowedAccess) {
    return;
  }
  const enableAccessLink = `chrome://extensions/?id=${chrome.runtime.id}`;
  const message =
    "Please enable incognito access for Incognito Switcher to work properly. Click here to adjust the settings.";

  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "../icon/icon.png",
      title: "Enable Incognito Access",
      message: message,
    },
    (notificationId) => {
      chrome.notifications.onClicked.addListener((clickedNotificationId) => {
        if (clickedNotificationId === notificationId) {
          chrome.tabs.create({ url: enableAccessLink });
          chrome.notifications.clear(notificationId);
        }
      });
    }
  );
});

function onActionClicked(tab: chrome.tabs.Tab) {
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

type WindowFocusInfo = {
  windowId: number;
  lastFocused: Date;
  incognito: boolean;
};

let sortedWindows: WindowFocusInfo[] = [];
const initializeSortedWindows = () => {
  chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
    sortedWindows = windows.map(getWindowFocusInfo);
    console.log("sortedWindows", sortedWindows);
  });
};

const createContextMenu = (actionType: "link" | "page" | "selection") => {
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
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
      } else {
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
});

async function createNewTabInOppositeMode(url: string, incognito: boolean) {
  const targetWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito !== incognito);
  if (targetWindowInfo === undefined) {
    console.log("No target window found, creating new window.");
    await chrome.windows.create({
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
}

function isURL(text: string) {
  let url;
  try {
    url = new URL(text);
  } catch (e) {
    return false;
  }
  return true;
}
