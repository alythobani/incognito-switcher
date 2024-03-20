import { onContextMenuItemClicked } from "../actions/contextMenus/contextMenus";
import { convertToCallback } from "../utils/utils";

/* Exports */

export function setupContextMenus(): void {
  chrome.contextMenus.onClicked.addListener(convertToCallback(onContextMenuItemClicked));
}
