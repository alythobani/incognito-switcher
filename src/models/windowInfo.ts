import { incognitoBooleanToMode, type IncognitoMode } from "./incognitoMode";

export class WindowInfo {
  windowId: number;
  lastFocused: Date;
  mode: IncognitoMode;
  activeTabTitle: string | null;

  constructor({ window, isFocused }: { window: chrome.windows.Window; isFocused: boolean }) {
    if (window.id === undefined) {
      throw new Error(
        `Cannot construct WindowInfo, window.id is undefined: ${JSON.stringify(window)}`
      );
    }
    this.windowId = window.id;
    this.lastFocused = isFocused ? new Date() : new Date(0);
    this.mode = incognitoBooleanToMode(window.incognito);
    this.activeTabTitle = getActiveTabTitleIfExists(window);
  }
}

const getActiveTabTitleIfExists = (window: chrome.windows.Window): string | null => {
  const activeTabTitle = window.tabs?.find((tab) => tab.active)?.title;
  if (activeTabTitle === undefined) {
    return null;
  }
  return activeTabTitle;
};
