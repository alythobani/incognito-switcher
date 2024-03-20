import { switchTabToOppositeMode } from "../tabActions";

export async function onSwitchIncognitoMode(tab: chrome.tabs.Tab): Promise<void> {
  await switchTabToOppositeMode(tab);
}
