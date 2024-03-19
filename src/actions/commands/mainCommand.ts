import { switchTabToOppositeMode } from "../tabActions/switchTabToOppositeMode";

export async function onMainCommand(tab: chrome.tabs.Tab): Promise<void> {
  console.log("onMainCommand", tab, tab.url, tab.incognito);
  await switchTabToOppositeMode(tab);
}
