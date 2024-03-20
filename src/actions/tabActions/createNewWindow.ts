import { modeToIncognitoBoolean, type IncognitoMode } from "../../models/incognitoMode";
import { isValidUrlForMode } from "../../utils/chromeUtils";
import { logWarning } from "../../utils/logger";

export async function createNewWindow({
  url,
  mode,
}: {
  url: string;
  mode: IncognitoMode;
}): Promise<boolean> {
  if (!isValidUrlForMode(url, mode)) {
    logWarning(`Can't open ${url} in ${mode} mode`);
    return false;
  }
  await chrome.windows.create({ url, incognito: modeToIncognitoBoolean(mode) });
  return true;
}
