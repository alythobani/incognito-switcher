export async function closeTab(tab: chrome.tabs.Tab): Promise<void> {
  if (tab.id === undefined) {
    throw new Error(`tab.id is undefined: ${JSON.stringify(tab)}`);
  }
  await chrome.tabs.remove(tab.id);
}
