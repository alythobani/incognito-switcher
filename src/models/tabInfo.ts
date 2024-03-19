export class TabInfo {
  tabId: number;
  title: string;
  isActive: boolean;
  constructor(tab: chrome.tabs.Tab) {
    if (tab.id === undefined) {
      throw new Error(`Cannot construct TabInfo, tab.id is undefined: ${JSON.stringify(tab)}`);
    }
    this.tabId = tab.id;
    if (tab.title === undefined) {
      throw new Error(`Cannot construct TabInfo, tab.title is undefined: ${JSON.stringify(tab)}`);
    }
    this.title = tab.title;
    this.isActive = tab.active;
  }
}
