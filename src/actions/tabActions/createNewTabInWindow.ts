export async function createNewTabInWindow({
  url,
  windowId,
}: {
  url: string;
  windowId: number;
}): Promise<void> {
  const newlyFocusedWindow = await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.create({
    windowId: newlyFocusedWindow.id,
    url,
    active: true,
  });
}
