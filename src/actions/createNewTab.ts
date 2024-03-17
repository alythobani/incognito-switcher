import { getLastFocusedWindowIdOfMode } from "../providers/sortedWindows";

export type Mode = "normal" | "incognito";

export function modeToIncognitoBoolean(mode: Mode): boolean {
  return mode === "incognito";
}

export function incognitoBooleanToMode(incognito: boolean): Mode {
  return incognito ? "incognito" : "normal";
}

export async function createNewTab({ url, mode }: { url: string; mode: Mode }): Promise<void> {
  const lastFocusedWindowId = await getLastFocusedWindowIdOfMode(mode);
  if (lastFocusedWindowId === null) {
    console.log("No target window found, creating new window.");
    await chrome.windows.create({ url, incognito: modeToIncognitoBoolean(mode) });
    return;
  }
  const newlyFocusedWindow = await chrome.windows.update(lastFocusedWindowId, { focused: true });
  await chrome.tabs.create({
    windowId: newlyFocusedWindow.id,
    url,
    active: true,
  });
}
