import { closeTab } from "../tabActions/closeTab";
import { createNewTabInWindow } from "../tabActions/createNewTabInWindow";
import { type ContextMenuClickHandler } from "./contextMenus";

export const onMoveTabToWindow: ContextMenuClickHandler = async (info, tab) => {
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
