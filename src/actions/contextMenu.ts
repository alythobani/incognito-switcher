import { getContextMenuTypeFromId } from "../setup/contextMenus/setupContextMenus";
import { isURL, throwExpectedNeverError } from "../utils";
import { closeTab } from "./closeTab";
import { createNewTab, incognitoBooleanToMode } from "./createNewTab";

/* Exports */

export async function onContextMenuItemClicked(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): Promise<void> {
  if (tab === undefined) {
    throw new Error("Context menu clicked with no active tab");
  }

  const url = getContextMenuTargetUrl(info);

  const isCurrentlyIncognito = tab.incognito;
  const newMode = incognitoBooleanToMode(!isCurrentlyIncognito);

  const didCreateTab = await createNewTab({ url, mode: newMode });

  if (didCreateTab && shouldCloseCurrentTab(info)) {
    await closeTab(tab);
  }
}

/* Implementation */

const getContextMenuTargetUrl = (info: chrome.contextMenus.OnClickData): string => {
  const contextMenuType = getContextMenuTypeFromId(info.menuItemId);
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
      throwExpectedNeverError(contextMenuType);
  }
};

const getSelectionTextTargetUrl = (selectionText: string): string => {
  const trimmedText = selectionText.trim();
  if (isURL(trimmedText)) {
    return trimmedText;
  }
  const encodedText = encodeURIComponent(trimmedText);
  return "https://www.google.com/search?q=" + encodedText;
};

const shouldCloseCurrentTab = (info: chrome.contextMenus.OnClickData): boolean => {
  const contextMenuType = getContextMenuTypeFromId(info.menuItemId);
  switch (contextMenuType) {
    case "link":
      return false;
    case "page":
      return true;
    case "selection":
      return false;
    default:
      throwExpectedNeverError(contextMenuType);
  }
};
