import { modeToIncognitoBoolean, type IncognitoMode } from "../../models/incognitoMode";
import { getLastFocusedWindowIdOfMode } from "../../providers/sortedWindows";
import { isInvalidChromeUrl } from "../../utils/chromeUtils";
import { createNewTabInWindow } from "./createNewTabInWindow";

/**
 * Creates a new tab in the last focused window of the given mode. Creates a new window if no window of the given mode exists.
 * @returns Whether the tab was successfully created
 */
export async function createNewTab({
  url,
  mode,
}: {
  url: string;
  mode: IncognitoMode;
}): Promise<boolean> {
  if (isInvalidChromeUrl(url) && mode === "incognito") {
    console.warn("Cannot open chrome:// URL in incognito mode: " + url);
    return false;
  }
  const lastFocusedWindowId = await getLastFocusedWindowIdOfMode(mode);
  if (lastFocusedWindowId === null) {
    console.log("No target window found, creating new window.");
    await chrome.windows.create({ url, incognito: modeToIncognitoBoolean(mode) });
    return true;
  }
  await createNewTabInWindow({ url, windowId: lastFocusedWindowId });
  return true;
}
