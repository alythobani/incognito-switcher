/* Types */

import { modeToIncognitoBoolean, type IncognitoMode } from "../models/incognitoMode";
import { log } from "../utils/logger";

type WindowFocusInfo = {
  windowId: number;
  lastFocused: Date;
  incognito: boolean;
  name: string | null;
};

/* Exports */

export async function startSortedWindowsInstance(): Promise<void> {
  await SortedWindowsProvider.getInstance();
}

export async function getSortedWindows(): Promise<WindowFocusInfo[]> {
  const sortedWindowsProvider = await SortedWindowsProvider.getInstance();
  return sortedWindowsProvider.getSortedWindows();
}

export async function getLastFocusedWindowIdOfMode(mode: IncognitoMode): Promise<number | null> {
  const incognito = modeToIncognitoBoolean(mode);
  const sortedWindows = await getSortedWindows();
  const lastFocusedWindowInfo = sortedWindows.find(
    (windowInfo) => windowInfo.incognito === incognito
  );
  return lastFocusedWindowInfo?.windowId ?? null;
}

/* Provider Class */

class SortedWindowsProvider {
  /* Private fields and methods */

  private static instance: SortedWindowsProvider | null = null;
  private sortedWindows: WindowFocusInfo[];

  private constructor(sortedWindows: WindowFocusInfo[]) {
    this.sortedWindows = sortedWindows;
    this.listenForWindowChanges();
  }

  private listenForWindowChanges(): void {
    this.listenForWindowCreation();
    this.listenForWindowRemoval();
    this.listenForWindowFocusChange();
  }

  private listenForWindowCreation(): void {
    chrome.windows.onCreated.addListener((window) => {
      this.sortedWindows.unshift(getNewWindowFocusInfo(window));
    });
  }

  private listenForWindowRemoval(): void {
    chrome.windows.onRemoved.addListener((windowId) => {
      this.sortedWindows = this.sortedWindows.filter((window) => window.windowId !== windowId);
    });
  }

  private listenForWindowFocusChange(): void {
    chrome.windows.onFocusChanged.addListener((windowId) => {
      void onWindowFocus({ windowId, sortedWindowsProvider: this });
    });
  }

  /* Exposed methods */

  public static async getInstance(): Promise<SortedWindowsProvider> {
    if (SortedWindowsProvider.instance === null) {
      const sortedWindows = await initializeSortedWindows();
      SortedWindowsProvider.instance = new SortedWindowsProvider(sortedWindows);
    }
    return SortedWindowsProvider.instance;
  }

  public getSortedWindows(): WindowFocusInfo[] {
    return this.sortedWindows;
  }

  public setSortedWindows(sortedWindows: WindowFocusInfo[]): void {
    this.sortedWindows = sortedWindows;
  }

  public sortWindows(): void {
    this.sortedWindows.sort((a, b) => b.lastFocused.valueOf() - a.lastFocused.valueOf());
  }
}

/* Implementation */

const initializeSortedWindows = async (): Promise<WindowFocusInfo[]> => {
  log("Initializing sortedWindows");
  let sortedWindows: WindowFocusInfo[] = [];
  const allWindows = await queryWindows();
  log("All queried windows:", allWindows);
  sortedWindows = allWindows.map(getNewWindowFocusInfo);
  log("Initial sortedWindows:", sortedWindows);
  return sortedWindows;
};

const queryWindows = async (): Promise<chrome.windows.Window[]> => {
  return await new Promise((resolve) => {
    chrome.windows.getAll({ windowTypes: ["normal"], populate: true }, (windows) => {
      resolve(windows);
    });
  });
};

const getNewWindowFocusInfo = (window: chrome.windows.Window): WindowFocusInfo => {
  if (window.id === undefined) {
    throw new Error("window.id is undefined");
  }
  return {
    windowId: window.id,
    lastFocused: new Date(),
    incognito: window.incognito,
    name: getActiveTabTitleIfExists(window),
  };
};

const getActiveTabTitleIfExists = (window: chrome.windows.Window): string | null => {
  const activeTabTitle = window.tabs?.find((tab) => tab.active)?.title;
  if (activeTabTitle === undefined) {
    return null;
  }
  return activeTabTitle;
};

const onWindowFocus = async ({
  windowId,
  sortedWindowsProvider,
}: {
  windowId: number;
  sortedWindowsProvider: SortedWindowsProvider;
}): Promise<void> => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    return;
  }
  const sortedWindows = sortedWindowsProvider.getSortedWindows();
  const windowFocusInfo = sortedWindows.find((windowInfo) => windowInfo.windowId === windowId);
  if (windowFocusInfo === undefined) {
    throw new Error(`Window from onFocusChanged not found: ${windowId}`);
  }
  windowFocusInfo.lastFocused = new Date();
  sortedWindowsProvider.sortWindows();
};
