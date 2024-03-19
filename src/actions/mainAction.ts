import { getExtensionSettingsURL } from "../utils/chromeUtils";
import { createNewTab } from "./tabActions/createNewTab";

export const onMainAction = async (tab: chrome.tabs.Tab): Promise<void> => {
  console.log("onMainAction", tab, tab.url, tab.incognito);
  await createNewTab({ url: getExtensionSettingsURL(), mode: "normal" });
};
