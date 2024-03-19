/* Types */

import { modeToIncognitoBoolean, type IncognitoMode } from "../models/incognitoMode";
import { TabInfo } from "../models/tabInfo";
import { WindowInfo } from "../models/windowInfo";
import { log, logWarning } from "../utils/logger";

type WindowInfoById = Map<number, WindowInfo>;

/* Exports */

export async function startTrackingWindowInfos(): Promise<void> {
  await WindowInfosProvider.getInstance();
}

export async function getWindowInfos(): Promise<WindowInfoById> {
  const windowInfosProvider = await WindowInfosProvider.getInstance();
  return windowInfosProvider.getWindowInfoById();
}

export async function getLastFocusedWindowIdOfMode(mode: IncognitoMode): Promise<number | null> {
  const windowInfosProvider = await WindowInfosProvider.getInstance();
  const windowInfoById = windowInfosProvider.getWindowInfoById();
  const windowInfosSortedByLastFocused = Object.values(windowInfoById).sort(
    (a, b) => b.lastFocused.getTime() - a.lastFocused.getTime()
  );
  const lastFocusedWindowInfoOfMode = windowInfosSortedByLastFocused.find(
    (windowInfo) => windowInfo.incognito === modeToIncognitoBoolean(mode)
  );
  return lastFocusedWindowInfoOfMode?.windowId ?? null;
}

/* Provider Class */

class WindowInfosProvider {
  /* Private fields and methods */

  private static instance: WindowInfosProvider | null = null;
  private readonly windowInfoById: WindowInfoById;

  private constructor(windowInfoById: WindowInfoById) {
    this.windowInfoById = windowInfoById;
    this.listenForWindowAndTabChanges();
  }

  private listenForWindowAndTabChanges(): void {
    this.listenForWindowChanges();
    this.listenForTabChanges();
  }

  private listenForWindowChanges(): void {
    this.listenForWindowCreation();
    this.listenForWindowRemoval();
    this.listenForWindowFocusChange();
  }

  private listenForWindowCreation(): void {
    chrome.windows.onCreated.addListener((window) => {
      const newWindowInfo = new WindowInfo({ window, isFocused: true });
      this.windowInfoById.set(newWindowInfo.windowId, newWindowInfo);
      log(`Window ${newWindowInfo.windowId} created`);
    });
  }

  private listenForWindowRemoval(): void {
    chrome.windows.onRemoved.addListener((windowId) => {
      this.windowInfoById.delete(windowId);
      log(`Window ${windowId} removed`);
    });
  }

  private listenForWindowFocusChange(): void {
    chrome.windows.onFocusChanged.addListener((windowId) => {
      void onWindowFocus({ windowId, windowInfosProvider: this });
    });
  }

  private listenForTabChanges(): void {
    this.listenForTabCreation();
    this.listenForActiveTabChange();
  }

  private listenForTabCreation(): void {
    chrome.tabs.onCreated.addListener((tab) => {
      onTabCreated({ tab, windowInfosProvider: this });
    });
  }

  private listenForActiveTabChange(): void {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      void onTabActivated({ activeInfo, windowInfosProvider: this });
    });
  }

  /* Exposed methods */

  public static async getInstance(): Promise<WindowInfosProvider> {
    if (WindowInfosProvider.instance === null) {
      const windowInfoById = await initializeWindowInfoById();
      WindowInfosProvider.instance = new WindowInfosProvider(windowInfoById);
    }
    return WindowInfosProvider.instance;
  }

  public getWindowInfoById(): WindowInfoById {
    return this.windowInfoById;
  }

  public getWindowInfo(windowId: number): WindowInfo | undefined {
    return this.windowInfoById.get(windowId);
  }
}

/* Implementation */

const initializeWindowInfoById = async (): Promise<WindowInfoById> => {
  const windowInfoById: WindowInfoById = new Map();
  const allWindows = await queryWindows();
  log("Initial queried windows:", allWindows);
  allWindows.forEach((window) => {
    const newWindowInfo = new WindowInfo({ window, isFocused: window.focused });
    windowInfoById.set(newWindowInfo.windowId, newWindowInfo);
  });
  log("Initial windowInfoById:", windowInfoById);
  return windowInfoById;
};

const queryWindows = async (): Promise<chrome.windows.Window[]> => {
  return await new Promise((resolve) => {
    chrome.windows.getAll({ windowTypes: ["normal"], populate: true }, (windows) => {
      resolve(windows);
    });
  });
};

const onWindowFocus = async ({
  windowId,
  windowInfosProvider,
}: {
  windowId: number;
  windowInfosProvider: WindowInfosProvider;
}): Promise<void> => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    return;
  }
  const windowInfoById = windowInfosProvider.getWindowInfoById();
  const windowInfo = windowInfoById.get(windowId);
  if (windowInfo === undefined) {
    logWarning(`Window ${windowId} not found; returning without updating lastFocused`);
    return;
  }
  const previousLastFocused = windowInfo.lastFocused;
  windowInfo.lastFocused = new Date();
  log(
    `Window ${windowId} lastFocused updated: ${previousLastFocused.toLocaleString()} => ${windowInfo.lastFocused.toLocaleString()}`
  );
};

const onTabCreated = ({
  tab,
  windowInfosProvider,
}: {
  tab: chrome.tabs.Tab;
  windowInfosProvider: WindowInfosProvider;
}): void => {
  const { windowId } = tab;
  const windowInfo = windowInfosProvider.getWindowInfo(windowId);
  if (windowInfo === undefined) {
    logWarning(`WindowInfo ${windowId} not found; returning early from onTabCreated`);
    return;
  }
  const newTabInfo = new TabInfo(tab);
  windowInfo.tabInfoById.set(newTabInfo.tabId, newTabInfo);
  log(`WindowInfo ${windowId} updated with new Tab ${tab.id} created in Window ${windowId}`);
};

const onTabActivated = async ({
  activeInfo,
  windowInfosProvider,
}: {
  activeInfo: chrome.tabs.TabActiveInfo;
  windowInfosProvider: WindowInfosProvider;
}): Promise<void> => {
  const { tabId, windowId } = activeInfo;
  const windowInfoById = windowInfosProvider.getWindowInfoById();
  const windowInfo = windowInfoById.get(windowId);
  if (windowInfo === undefined) {
    logWarning(`WindowInfo ${windowId} not found; returning early from onTabActivated`);
    return;
  }
  const tabInfo = windowInfo.tabInfoById.get(tabId);
  if (tabInfo === undefined) {
    logWarning(
      `TabInfo ${tabId} not found in WindowInfo ${windowId}; returning early from onTabActivated`
    );
    return;
  }
  tabInfo.isActive = true;
  log(`WindowInfo ${windowId} updated with new active Tab ${tabId}`);
};
