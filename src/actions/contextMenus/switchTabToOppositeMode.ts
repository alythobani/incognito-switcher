import { switchTabToOppositeMode } from "../tabActions";
import { type ContextMenuClickHandler } from "./contextMenus";

export const onSwitchTabToOppositeMode: ContextMenuClickHandler = async (info, tab) => {
  if (tab === undefined) {
    throw new Error(`onSwitchTabToOppositeMode called with no active tab: ${JSON.stringify(info)}`);
  }
  await switchTabToOppositeMode(tab);
};
