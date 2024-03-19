import { openExtensionSettings } from "./openExtensionSettings";

export const onMainAction = async (tab: chrome.tabs.Tab): Promise<void> => {
  console.log("onMainAction", tab, tab.url, tab.incognito);
  await openExtensionSettings(tab);
};
