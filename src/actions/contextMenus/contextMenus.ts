import { onMoveTabToWindow } from "./moveTabToWindow";
import { onOpenLinkInOppositeMode } from "./openLinkInOppositeMode";
import { onOpenTabInOppositeMode } from "./openTabInOppositeMode";

/* Types */

type ContextMenuItem = chrome.contextMenus.CreateProperties & {
  onClick: ContextMenuClickHandler | null;
};

export type ContextMenuClickHandler = (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => Promise<void>;

/* Exports */

const contextMenus: Record<string, ContextMenuItem> = {
  openLinkInOppositeMode: {
    id: "openLinkInOppositeMode",
    title: "Open this link in Incognito/Normal",
    contexts: ["link"],
    onClick: onOpenLinkInOppositeMode,
  },
  openTabInOppositeMode: {
    id: "openTabInOppositeMode",
    title: "Move this tab to Incognito/Normal",
    contexts: ["page"],
    onClick: onOpenTabInOppositeMode,
  },
  moveTabToAnotherWindow: {
    id: "moveTabToAnotherWindow",
    title: "Move this tab to another window",
    contexts: ["page"],
    onClick: null,
  },
};

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
