import { getOppositeMode } from "../../models/incognitoMode";
import { createTabInLastFocusedWindowOfMode } from "../tabActions";
import { type ContextMenuClickHandler } from "./contextMenus";

export const onOpenLinkInOppositeMode: ContextMenuClickHandler = async (info, tab) => {
  if (tab === undefined) {
    throw new Error(`onOpenLinkInOppositeMode called with no active tab: ${JSON.stringify(info)}`);
  }
  if (info.linkUrl === undefined) {
    throw new Error(`info.linkUrl is undefined: ${JSON.stringify(info)}`);
  }
  await createTabInLastFocusedWindowOfMode({ url: info.linkUrl, mode: getOppositeMode(tab) });
};
