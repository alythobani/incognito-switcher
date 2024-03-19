import { onContextMenuItemClicked } from "../actions/contextMenus/contextMenus";
import { getWindowInfos } from "../providers/windowInfos";
import { convertToCallback } from "../utils/utils";

/* Exports */

export function setupContextMenus(): void {
  chrome.runtime.onInstalled.addListener(convertToCallback(createContextMenus));
  chrome.contextMenus.onClicked.addListener(convertToCallback(onContextMenuItemClicked));
}

/* Implementation */

const createContextMenus = async (): Promise<void> => {
  chrome.contextMenus.create({
    id: "openLinkInOppositeMode",
    title: "Open this link in Incognito/Normal",
    contexts: ["link"],
  });

  chrome.contextMenus.create({
    id: "openTabInOppositeMode",
    contexts: ["page"],
    title: "Move this tab to Incognito/Normal",
  });

  chrome.contextMenus.create({
    id: "moveTabToAnotherWindow",
    contexts: ["page"],
    title: "Move this tab to another window",
  });
  await createInitialMoveToWindowSubmenus();
};

const createInitialMoveToWindowSubmenus = async (): Promise<void> => {
  const windowInfoById = await getWindowInfos();
  for (const [windowIdx, windowInfo] of windowInfoById.entries()) {
    chrome.contextMenus.create({
      id: `moveTabToWindow${windowInfo.windowId}`,
      parentId: "moveTabToAnotherWindow",
      contexts: ["page"],
      title: windowInfo.getContextMenuItemTitle(windowIdx),
    });
  }
};
