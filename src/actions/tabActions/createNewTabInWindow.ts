import { type IncognitoMode } from "../../models/incognitoMode";
import { isValidUrlForMode } from "../../utils/chromeUtils";
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
  if (!isValidUrlForMode(url, mode)) {
    logWarning(`Can't open ${url} in ${mode} mode`);
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
