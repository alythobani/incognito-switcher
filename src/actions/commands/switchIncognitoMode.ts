import { incognitoBooleanToMode } from "../../models/incognitoMode";
import { closeTab } from "../tabActions/closeTab";
import { createNewTab } from "../tabActions/createNewTab";

export async function switchIncognitoMode(tab: chrome.tabs.Tab): Promise<void> {
  console.log("switchIncognitoMode", tab.url, tab.incognito);

  if (tab.url === undefined) {
    throw new Error(`tab.url is undefined: ${JSON.stringify(tab)}`);
  }

  const isCurrentlyIncognito = tab.incognito;
  const newMode = incognitoBooleanToMode(!isCurrentlyIncognito);

  const didCreateTab = await createNewTab({ url: tab.url, mode: newMode });

  if (didCreateTab) {
    await closeTab(tab);
  }
}
