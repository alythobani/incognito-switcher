import { createNewTab } from "./createNewTab";

export const onMainAction = async (tab: chrome.tabs.Tab): Promise<void> => {
  console.log("onMainAction", tab, tab.url, tab.incognito);
  await createNewTab({ url: `chrome://extensions/?id=${chrome.runtime.id}`, mode: "normal" });
};
