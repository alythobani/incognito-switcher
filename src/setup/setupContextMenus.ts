import { onContextMenuItemClicked } from "../actions/contextMenus/contextMenus";
import { createContextMenuItems } from "../providers/contextMenus";
import { convertToCallback } from "../utils/utils";

/* Exports */

export function setupContextMenus(): void {
  chrome.runtime.onInstalled.addListener(convertToCallback(createContextMenuItems));
  chrome.contextMenus.onClicked.addListener(convertToCallback(onContextMenuItemClicked));
}
