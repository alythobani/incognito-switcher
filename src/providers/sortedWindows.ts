/* Exports */

export async function getSortedWindows(): Promise<WindowFocusInfo[]> {
  const sortedWindowsProvider = await SortedWindowsProvider.getInstance();
  return sortedWindowsProvider.getSortedWindows();
}

export async function setSortedWindows(sortedWindows: WindowFocusInfo[]): Promise<void> {
  const sortedWindowsProvider = await SortedWindowsProvider.getInstance();
  sortedWindowsProvider.setSortedWindows(sortedWindows);
}

/* Implementation */

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
}

type WindowFocusInfo = {
  windowId: number;
  lastFocused: Date;
  incognito: boolean;
};

const initializeSortedWindows = async (): Promise<WindowFocusInfo[]> => {
  let sortedWindows: WindowFocusInfo[] = [];
  const allWindows = await queryWindows();
  sortedWindows = allWindows.map(getNewWindowFocusInfo);
  return sortedWindows;
};

const queryWindows = async (): Promise<chrome.windows.Window[]> => {
  return await new Promise((resolve) => {
    chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
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
  };
};
