import { closeTab } from "./closeTab";
import { createNewTab, incognitoBooleanToMode } from "./createNewTab";

export const switchTabToOppositeMode = async (tab: chrome.tabs.Tab): Promise<void> => {
  console.log("switchTabToOppositeMode", tab.url, tab.incognito);

  if (tab.url === undefined) {
    throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
  }

  const isCurrentlyIncognito = tab.incognito;
  const newMode = incognitoBooleanToMode(!isCurrentlyIncognito);

  const didCreateTab = await createNewTab({ url: tab.url, mode: newMode });

  if (didCreateTab) {
    await closeTab(tab);
  }
};