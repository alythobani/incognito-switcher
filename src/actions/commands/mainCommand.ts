import { switchTabToOppositeMode } from "../switchTabToOppositeMode";

export async function onMainCommand(tab: chrome.tabs.Tab): Promise<void> {
  console.log("onMainCommand", tab, tab.url, tab.incognito);
  await switchTabToOppositeMode(tab);
}
