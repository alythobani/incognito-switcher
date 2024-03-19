export function isInvalidChromeUrl(url: string): boolean {
  return url.startsWith("chrome://") && !url.startsWith("chrome://newtab/");
}

export function getExtensionSettingsURL(): string {
  return `chrome://extensions/?id=${chrome.runtime.id}`;
}
