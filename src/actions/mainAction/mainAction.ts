import { log } from "../../utils/logger";
import { openExtensionSettings } from "../tabActions";

export const onMainAction = async (tab: chrome.tabs.Tab): Promise<void> => {
  log("onMainAction", tab, tab.url, tab.incognito);
  await openExtensionSettings();
};
