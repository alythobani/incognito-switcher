import { type IncognitoMode } from "../../models/incognitoMode";
import { type WindowInfo } from "../../models/windowInfo";
import { getWindowInfosByMode } from "../../providers/windowInfos";
import { capitalize } from "../../utils/utils";
import { closeTab, createNewTabInWindow } from "../tabActions";
import { type ContextMenuClickHandler, type ContextMenuItem } from "./contextMenus";

/* Exports */

export const getMoveTabToWindowContextMenuItems = async (): Promise<ContextMenuItem[]> => {
  const windowInfosByMode = await getWindowInfosByMode();
  const normalWindowItems = windowInfosByMode.normal.map(getMoveTabToWindowContextMenuItem);
  const incognitoWindowItems = windowInfosByMode.incognito.map(getMoveTabToWindowContextMenuItem);
  return [
    moveTabToWindowContextMenuItemParent,
    getMoveTabToWindowModeHeaderItem("normal"),
    ...normalWindowItems,
    getMoveTabToWindowModeHeaderItem("incognito"),
    ...incognitoWindowItems,
  ];
};

/* Implementation */

const moveTabToWindowContextMenuItemParent: ContextMenuItem = {
  id: "moveTabToAnotherWindow",
  title: "Move this tab to another window",
  contexts: ["page"],
  onClick: null,
};

const getMoveTabToWindowModeHeaderItem = (mode: IncognitoMode): ContextMenuItem => {
  const capitalizedMode = capitalize(mode);
  return {
    id: `moveTabToWindow${capitalizedMode}Header`,
    parentId: moveTabToWindowContextMenuItemParent.id,
    contexts: ["page"],
    title: `${capitalizedMode} Windows`,
    onClick: null,
    enabled: false,
  };
};

const getMoveTabToWindowContextMenuItem = (windowInfo: WindowInfo): ContextMenuItem => ({
  id: `moveTabToWindow${windowInfo.windowId}`,
  parentId: moveTabToWindowContextMenuItemParent.id,
  contexts: ["page"],
  title: windowInfo.getContextMenuItemTitle(),
  onClick: getMoveTabToWindowHandler(windowInfo),
});

export const getMoveTabToWindowHandler = (windowInfo: WindowInfo): ContextMenuClickHandler => {
  return async (info, tab) => {
    if (tab === undefined) {
      throw new Error(`onMoveTabToWindow called with no active tab: ${JSON.stringify(info)}`);
    }
    if (tab.url === undefined) {
      throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
    }
    const { windowId, mode } = windowInfo;

    const didCreateTab = await createNewTabInWindow({ url: tab.url, windowId, mode });
    if (didCreateTab) {
      await closeTab(tab);
    }
  };
};
