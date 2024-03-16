import { getSortedWindows } from "../providers/sortedWindows";

/* Exports */

export function incognitoBooleanToMode(incognito: boolean): Mode {
  return incognito ? "incognito" : "normal";
}

export async function createNewTab({ url, mode }: { url: string; mode: Mode }): Promise<void> {
  const incognito = modeToIncognitoBoolean(mode);
  const sortedWindows = getSortedWindows();
  const targetWindowInfo = sortedWindows.find((windowInfo) => windowInfo.incognito === incognito);
  if (targetWindowInfo === undefined) {
    // TODO - re-query chrome windows and try again
    console.log("No target window found, creating new window.");
    await chrome.windows.create({ url, incognito });
    return;
  }
  chrome.windows.update(targetWindowInfo.windowId, { focused: true }, (focusedWindow) => {
    void chrome.tabs.create({
      windowId: focusedWindow.id,
      url,
      active: true,
    });
  });
}

/* Implementation */

type Mode = "normal" | "incognito";

const modeToIncognitoBoolean = (mode: Mode): boolean => mode === "incognito";
