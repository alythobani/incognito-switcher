import { type IncognitoMode } from "../models/incognitoMode";

export function isValidUrlForMode(url: string, mode: IncognitoMode): boolean {
  if (url.startsWith("chrome://") && !url.startsWith("chrome://newtab/") && mode === "incognito") {
    return false;
  }
  return true;
}

export function getExtensionSettingsURL(): string {
  return `chrome://extensions/?id=${chrome.runtime.id}`;
}
