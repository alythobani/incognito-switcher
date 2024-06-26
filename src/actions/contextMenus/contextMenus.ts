import { getContextMenuItem } from "../../providers/contextMenus";
import { getMoveTabToWindowContextMenuItems } from "./moveTabToWindow";
import { onOpenLinkInOppositeMode } from "./openLinkInOppositeMode";

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

export const getAllContextMenuItems = async (): Promise<ContextMenuItem[]> => {
  const moveTabToWindowContextMenuItems = await getMoveTabToWindowContextMenuItems();
  return [openLinkInOppositeModeContextMenuItem, ...moveTabToWindowContextMenuItems];
};

export const onContextMenuItemClicked: ContextMenuClickHandler = async (info, tab) => {
  const contextMenuItem = await getContextMenuItem(info.menuItemId);
  if (contextMenuItem === undefined) {
    throw new Error(`contextMenuItem not found: ${info.menuItemId}`);
  }
  await contextMenuItem.onClick?.(info, tab);
};
