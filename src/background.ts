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
  createContextMenu("link");
  createContextMenu("page");
  createContextMenu("selection");
});

function createContextMenu(actionType: "link" | "page" | "selection") {
  chrome.contextMenus.create({
    id: `${actionType}Item`,
    title: chrome.i18n.getMessage(`${actionType}ContextMenu`),
    contexts: [actionType],
  });
}

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

function createNewTabInOppositeMode(url: string, incognito: boolean) {
  chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      if (!window.id) {
        return;
      }
      if (window.incognito != incognito) {
        chrome.windows.update(window.id, { focused: true }, function (focused_window) {
          chrome.tabs.create({ windowId: focused_window.id, url: url, active: true });
        });
        return;
      }
    }
    chrome.windows.create({ url: url, incognito: !incognito });
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
