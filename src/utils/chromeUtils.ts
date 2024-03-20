import { type IncognitoMode } from "../models/incognitoMode";

export function isInvalidChromeUrl(url: string, mode: IncognitoMode): boolean {
  if (mode === "normal" || url.startsWith("chrome://newtab/")) {
    return false;
  }
  return url.startsWith("chrome://");
}

export function getExtensionSettingsURL(): string {
  return `chrome://extensions/?id=${chrome.runtime.id}`;
}
