import { switchIncognitoMode } from "../commands/switchIncognitoMode";
import { type ContextMenuClickHandler } from "./contextMenus";

export const onOpenTabInOppositeMode: ContextMenuClickHandler = async (info, tab) => {
  if (tab === undefined) {
    throw new Error(`onOpenTabInOppositeMode called with no active tab: ${JSON.stringify(info)}`);
  }
  await switchIncognitoMode(tab);
};
