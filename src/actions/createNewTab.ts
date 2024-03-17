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
  chrome.windows.update(lastFocusedWindowId, { focused: true }, (focusedWindow) => {
    void chrome.tabs.create({
      windowId: focusedWindow.id,
      url,
      active: true,
    });
  });
}
