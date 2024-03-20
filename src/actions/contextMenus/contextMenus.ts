import { getContextMenuItem } from "../../providers/contextMenus";
import { getMoveTabToWindowContextMenuItems } from "./moveTabToWindow";
import { onOpenLinkInOppositeMode } from "./openLinkInOppositeMode";
import { onOpenTabInOppositeMode } from "./openTabInOppositeMode";

/* Types */

export type ContextMenuItem = Omit<chrome.contextMenus.CreateProperties, "id" | "onclick"> & {
  id: string;
  onClick: ContextMenuClickHandler | null;
};

export type ContextMenuClickHandler = (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => Promise<void>;

/* Exports */

const openLinkInOppositeModeContextMenuItem: ContextMenuItem = {
  id: "openLinkInOppositeMode",
  title: "Open this link in Incognito/Normal",
  contexts: ["link"],
  onClick: onOpenLinkInOppositeMode,
};

const openTabInOppositeModeContextMenuItem: ContextMenuItem = {
  id: "openTabInOppositeMode",
  title: "Move this tab to Incognito/Normal",
  contexts: ["page"],
  onClick: onOpenTabInOppositeMode,
};

export const getAllContextMenuItems = async (): Promise<ContextMenuItem[]> => {
  const moveTabToWindowContextMenuItems = await getMoveTabToWindowContextMenuItems();
  return [
    openLinkInOppositeModeContextMenuItem,
    openTabInOppositeModeContextMenuItem,
    ...moveTabToWindowContextMenuItems,
  ];
};

export const onContextMenuItemClicked: ContextMenuClickHandler = async (info, tab) => {
  const contextMenuItem = await getContextMenuItem(info.menuItemId);
  if (contextMenuItem === undefined) {
    throw new Error(`contextMenuItem not found: ${info.menuItemId}`);
  }
  await contextMenuItem.onClick?.(info, tab);
};
