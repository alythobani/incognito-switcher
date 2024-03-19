import { incognitoBooleanToMode, type IncognitoMode } from "./incognitoMode";
import { TabInfo } from "./tabInfo";

export class WindowInfo {
  windowId: number;
  lastFocused: Date;
  mode: IncognitoMode;
  tabInfoById: Map<number, TabInfo>;

  constructor({ window, isFocused }: { window: chrome.windows.Window; isFocused: boolean }) {
    if (window.id === undefined) {
      throw new Error(
        `Cannot construct WindowInfo, window.id is undefined: ${JSON.stringify(window)}`
      );
    }
    this.windowId = window.id;
    this.lastFocused = isFocused ? new Date() : new Date(0);
    this.mode = incognitoBooleanToMode(window.incognito);
    this.tabInfoById = initializeTabInfoById(window.tabs ?? []);
  }

  getName(): string {
    return `Window ${this.windowId}`;
  }

  getActiveTabName(): string {
    const activeTabInfo = this.getActiveTabInfo();
    return activeTabInfo?.title ?? "No active tab";
  }

  getActiveTabInfo(): TabInfo | undefined {
    return Array.from(this.tabInfoById.values()).find((tabInfo) => tabInfo.isActive);
  }

  getContextMenuItemTitle(windowIdx: number): string {
    const windowName = this.getName();
    const activeTabName = this.getActiveTabName();
    const numTabs = this.tabInfoById.size;
    return `${windowName} [${activeTabName}] (${numTabs})`;
  }
}

const initializeTabInfoById = (tabs: chrome.tabs.Tab[]): Map<number, TabInfo> => {
  const tabInfoById = new Map<number, TabInfo>();
  tabs.forEach((tab) => {
    const tabInfo = new TabInfo(tab);
    tabInfoById.set(tabInfo.tabId, tabInfo);
  });
  return tabInfoById;
};
