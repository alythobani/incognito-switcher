import { incognitoBooleanToMode } from "../models/incognitoMode";
import { switchIncognitoMode } from "./commands/switchIncognitoMode";
import { closeTab } from "./tabActions/closeTab";
import { createNewTab } from "./tabActions/createNewTab";
import { createNewTabInWindow } from "./tabActions/createNewTabInWindow";

/* Exports */

type ContextMenuClickHandler = (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => Promise<void>;

export const onContextMenuItemClicked: ContextMenuClickHandler = async (info, tab) => {
  switch (info.menuItemId) {
    case "openLinkInOppositeMode":
      await onOpenLinkInOppositeMode(info, tab);
      return;
    case "openTabInOppositeMode":
      await onOpenTabInOppositeMode(info, tab);
      return;
    case "moveTabToAnotherWindow":
      return;
    default: {
      await onMoveTabToWindow(info, tab);
    }
  }
};

/* Implementation */

const onOpenLinkInOppositeMode: ContextMenuClickHandler = async (info, tab) => {
  if (tab === undefined) {
    throw new Error(`onOpenLinkInOppositeMode called with no active tab: ${JSON.stringify(info)}`);
  }
  if (info.linkUrl === undefined) {
    throw new Error(`info.linkUrl is undefined: ${JSON.stringify(info)}`);
  }
  const newMode = incognitoBooleanToMode(!tab.incognito);
  await createNewTab({ url: info.linkUrl, mode: newMode });
};

const onOpenTabInOppositeMode: ContextMenuClickHandler = async (info, tab) => {
  if (tab === undefined) {
    throw new Error(`onOpenTabInOppositeMode called with no active tab: ${JSON.stringify(info)}`);
  }
  await switchIncognitoMode(tab);
};

const onMoveTabToWindow: ContextMenuClickHandler = async (info, tab) => {
  if (tab === undefined) {
    throw new Error(`onMoveTabToWindow called with no active tab: ${JSON.stringify(info)}`);
  }
  const windowId = parseWindowIdFromMenuItemId(info.menuItemId);
  if (tab.url === undefined) {
    throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
  }
  await createNewTabInWindow({ url: tab.url, windowId });
  await closeTab(tab);
};

const parseWindowIdFromMenuItemId = (menuItemId: string | number): number => {
  if (typeof menuItemId === "number") {
    throw new Error(`Unrecognized menuItemId of type number: ${menuItemId}`);
  }
  const moveTabToWindowRegex = /^moveTabToWindow(\d+)$/;
  const windowId = menuItemId.match(moveTabToWindowRegex)?.[1];
  if (windowId === undefined) {
    throw new Error(`menuItemId did not match moveTabToWindowRegex: ${menuItemId}`);
  }
  return parseInt(windowId);
};
