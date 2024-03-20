import { getOppositeMode } from "../../models/incognitoMode";
import { log } from "../../utils/logger";
import { closeTab } from "../tabActions/closeTab";
import { createTabInLastFocusedWindowOfMode } from "../tabActions/createTabInLastFocusedWindow";

export async function switchIncognitoMode(tab: chrome.tabs.Tab): Promise<void> {
  log("switchIncognitoMode", tab.url, tab.incognito);

  if (tab.url === undefined) {
    throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
  }

  const didCreateTab = await createTabInLastFocusedWindowOfMode({
    url: tab.url,
    mode: getOppositeMode(tab),
  });

  if (didCreateTab) {
    await closeTab(tab);
  }
}
