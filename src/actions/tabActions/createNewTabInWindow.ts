import { type IncognitoMode } from "../../models/incognitoMode";
import { isInvalidChromeUrl } from "../../utils/chromeUtils";
import { logWarning } from "../../utils/logger";

export async function createNewTabInWindow({
  url,
  windowId,
  mode,
}: {
  url: string;
  windowId: number;
  mode: IncognitoMode;
}): Promise<boolean> {
  if (isInvalidChromeUrl(url, mode)) {
    logWarning("Cannot open chrome:// URL in incognito mode: " + url);
    return false;
  }
  const newlyFocusedWindow = await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.create({
    windowId: newlyFocusedWindow.id,
    url,
    active: true,
  });
  return true;
}
