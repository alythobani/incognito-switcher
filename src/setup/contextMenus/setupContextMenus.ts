import { onContextMenuItemClicked } from "../../actions/contextMenu";
import { convertToCallback } from "../../utils/utils";

/* Exports */

export function setupContextMenus(): void {
  chrome.runtime.onInstalled.addListener(createContextMenus);
  chrome.contextMenus.onClicked.addListener(convertToCallback(onContextMenuItemClicked));
}

export function getContextMenuTypeFromId(
  contextMenuItemId: chrome.contextMenus.OnClickData["menuItemId"]
): ExtensionContextMenuType {
  const unexpectedMenuItemIdMsg = `Unexpected context menu item ID: ${contextMenuItemId}`;

  if (typeof contextMenuItemId !== "string") {
    throw new Error(unexpectedMenuItemIdMsg);
  }
  const contextTypeRegexStr = extensionContextMenuTypes.join("|");
  const contextMenuItemIdRegex = new RegExp(`^(?<contextMenuType>${contextTypeRegexStr})Item$`);

  const menuItemIdRegexMatch = contextMenuItemId.match(contextMenuItemIdRegex);
  if (menuItemIdRegexMatch === null) {
    throw new Error(unexpectedMenuItemIdMsg);
  }

  const contextMenuType = menuItemIdRegexMatch.groups?.contextMenuType;
  if (contextMenuType === undefined) {
    throw new Error(unexpectedMenuItemIdMsg);
  }

  return contextMenuType as ExtensionContextMenuType;
}

/* Implementation */

type ExtensionContextMenuType = Extract<
  chrome.contextMenus.ContextType,
  "link" | "page" | "selection"
>;
const extensionContextMenuTypes: readonly ExtensionContextMenuType[] = [
  "link",
  "page",
  "selection",
];
type ExtensionContextMenuItemId = `${ExtensionContextMenuType}Item`;

const createContextMenus = (): void => {
  createContextMenu("link");
  createContextMenu("page");
  createContextMenu("selection");
};

const createContextMenu = (contextMenuType: ExtensionContextMenuType): void => {
  chrome.contextMenus.create({
    id: getContextMenuItemId(contextMenuType),
    title: chrome.i18n.getMessage(`${contextMenuType}ContextMenu`),
    contexts: [contextMenuType],
  });
};

const getContextMenuItemId = (
  contextMenuType: ExtensionContextMenuType
): ExtensionContextMenuItemId => {
  return `${contextMenuType}Item`;
};
