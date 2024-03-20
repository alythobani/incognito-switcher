import { type IncognitoMode } from "../../models/incognitoMode";
import { isInvalidChromeUrl } from "../../utils/chromeUtils";
import { logWarning } from "../../utils/logger";

export async function createNewWindow({
  url,
  mode,
}: {
  url: string;
  mode: IncognitoMode;
}): Promise<boolean> {
  if (isInvalidChromeUrl(url, mode)) {
    logWarning("Cannot open chrome:// URL in incognito mode: " + url);
    return false;
  }
  const window = await chrome.windows.create({ url, incognito: mode === "incognito" });
  return window !== undefined;
}
