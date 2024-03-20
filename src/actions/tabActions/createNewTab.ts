import { type IncognitoMode } from "../../models/incognitoMode";
import { getLastFocusedWindowIdOfMode } from "../../providers/windowInfos";
import { logWarning } from "../../utils/logger";
import { createNewTabInWindow } from "./createNewTabInWindow";
import { createNewWindow } from "./createNewWindow";

//  TODO: rename
/**
 * Creates a new tab in the last focused window of the given mode. Creates a new window if no window of the given mode exists.
 * @returns Whether the tab was successfully created
 */
export async function createNewTab({
  url,
  mode,
}: {
  url: string;
  mode: IncognitoMode;
}): Promise<boolean> {
  const lastFocusedWindowId = await getLastFocusedWindowIdOfMode(mode);
  if (lastFocusedWindowId === null) {
    logWarning("No target window found, creating new window.");
    return await createNewWindow({ url, mode });
  }
  return await createNewTabInWindow({ url, windowId: lastFocusedWindowId, mode });
}
