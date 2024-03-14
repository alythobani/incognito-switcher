chrome.action.onClicked.addListener((tab) => {
  createNewTabInOppositeMode(tab.url, tab.incognito);
  chrome.tabs.remove(tab.id);
});

chrome.runtime.onInstalled.addListener(() => {
  createContextMenu("link");
  createContextMenu("page");
  createContextMenu("selection");
});

const createContextMenu = (actionType) => {
  chrome.contextMenus.create({
    id: `${actionType}Item`,
    title: chrome.i18n.getMessage(`${actionType}ContextMenu`),
    contexts: [actionType],
  });
};

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
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
    chrome.tabs.remove(tab.id);
  }
});

function createNewTabInOppositeMode(url, incognito) {
  chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
    for (let i = 0; i < windows.length; i++) {
      if (windows[i].incognito != incognito) {
        chrome.windows.update(windows[i].id, { focused: true }, function (focused_window) {
          chrome.tabs.create({ windowId: focused_window.id, url: url, active: true });
        });
        return;
      }
    }
    chrome.windows.create({ url: url, incognito: !incognito });
  });
}

function isURL(text) {
  let url;
  try {
    url = new URL(text);
  } catch (e) {
    return false;
  }
  return true;
}
