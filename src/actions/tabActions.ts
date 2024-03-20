import { modeToIncognitoBoolean, type IncognitoMode } from "../models/incognitoMode";
import { getLastFocusedWindowIdOfMode } from "../providers/windowInfos";
import { getExtensionSettingsURL, isValidUrlForMode } from "../utils/chromeUtils";
import { logWarning } from "../utils/logger";

export async function closeTab(tab: chrome.tabs.Tab): Promise<void> {
  if (tab.id === undefined) {
    throw new Error(`tab.id is undefined: ${JSON.stringify(tab)}`);
  }
  await chrome.tabs.remove(tab.id);
}

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

export async function createNewWindow({
  url,
  mode,
}: {
  url: string;
  mode: IncognitoMode;
}): Promise<boolean> {
  if (!isValidUrlForMode(url, mode)) {
    logWarning(`Can't open ${url} in ${mode} mode`);
    return false;
  }
  await chrome.windows.create({ url, incognito: modeToIncognitoBoolean(mode) });
  return true;
}

/**
 * Creates a new tab in the last focused window of the given mode. Creates a new window if no window of the given mode exists.
 * @returns Whether the tab was successfully created
 */
export async function createTabInLastFocusedWindowOfMode({
  url,
  mode,
}: {
  url: string;
  mode: IncognitoMode;
}): Promise<boolean> {
  const lastFocusedWindowId = await getLastFocusedWindowIdOfMode(mode);
  if (lastFocusedWindowId === null) {
    logWarning("No target window found, creating new window.");
    return await createNewWindow({ url, mode });
  }
  return await createNewTabInWindow({ url, windowId: lastFocusedWindowId, mode });
}

export const openExtensionSettings = async (): Promise<void> => {
  await createTabInLastFocusedWindowOfMode({ url: getExtensionSettingsURL(), mode: "normal" });
};
