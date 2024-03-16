/* Exports */

export function getSortedWindows(): WindowFocusInfo[] {
  return SortedWindowsProvider.getInstance().getSortedWindows();
}

export function setSortedWindows(sortedWindows: WindowFocusInfo[]): void {
  SortedWindowsProvider.getInstance().setSortedWindows(sortedWindows);
}

/* Implementation */

class SortedWindowsProvider {
  private static instance: SortedWindowsProvider | null = null;
  private sortedWindows: WindowFocusInfo[];

  private constructor() {
    this.sortedWindows = initializeSortedWindows();
    this.listenForWindowChanges();
  }

  private listenForWindowChanges(): void {
    this.listenForWindowCreation();
    this.listenForWindowRemoval();
    this.listenForWindowFocusChange();
  }

  private listenForWindowCreation(): void {
    chrome.windows.onCreated.addListener((window) => {
      this.sortedWindows.push(getNewWindowFocusInfo(window));
    });
  }

  private listenForWindowRemoval(): void {
    chrome.windows.onRemoved.addListener((windowId) => {
      this.sortedWindows = this.sortedWindows.filter((window) => window.windowId !== windowId);
    });
  }

  private listenForWindowFocusChange(): void {
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
      }
      for (const windowInfo of this.sortedWindows) {
        if (windowInfo.windowId === windowId) {
          windowInfo.lastFocused = new Date();
          break;
        }
      }
      // TODO: Handle focused window not found in sortedWindows (add it)
      this.sortWindows();
    });
  }

  private sortWindows(): void {
    this.sortedWindows.sort((a, b) => b.lastFocused.valueOf() - a.lastFocused.valueOf());
  }

  // Exposed methods

  public static getInstance(): SortedWindowsProvider {
    if (SortedWindowsProvider.instance === null) {
      SortedWindowsProvider.instance = new SortedWindowsProvider();
    }
    return SortedWindowsProvider.instance;
  }

  public getSortedWindows(): WindowFocusInfo[] {
    return this.sortedWindows;
  }

  public setSortedWindows(sortedWindows: WindowFocusInfo[]): void {
    this.sortedWindows = sortedWindows;
  }
}

type WindowFocusInfo = {
  windowId: number;
  lastFocused: Date;
  incognito: boolean;
};

const initializeSortedWindows = (): WindowFocusInfo[] => {
  let sortedWindows: WindowFocusInfo[] = [];
  chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
    sortedWindows = windows.map(getNewWindowFocusInfo);
  });
  return sortedWindows;
};

const getNewWindowFocusInfo = (window: chrome.windows.Window): WindowFocusInfo => {
  if (window.id === undefined) {
    throw new Error("window.id is undefined");
  }
  return {
    windowId: window.id,
    lastFocused: new Date(),
    incognito: window.incognito,
  };
};
