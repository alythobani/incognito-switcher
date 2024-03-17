import { getLastFocusedWindowIdOfMode } from "../providers/sortedWindows";
import { isInvalidChromeUrl } from "../utils";

export type Mode = "normal" | "incognito";

export function modeToIncognitoBoolean(mode: Mode): boolean {
  return mode === "incognito";
}

export function incognitoBooleanToMode(incognito: boolean): Mode {
  return incognito ? "incognito" : "normal";
}

/**
 * Creates a new tab in the last focused window of the given mode. Creates a new window if no window of the given mode exists.
 * @returns Whether the tab was successfully created
 */
export async function createNewTab({ url, mode }: { url: string; mode: Mode }): Promise<boolean> {
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
  const newlyFocusedWindow = await chrome.windows.update(lastFocusedWindowId, { focused: true });
  await chrome.tabs.create({
    windowId: newlyFocusedWindow.id,
    url,
    active: true,
  });
  return true;
}
