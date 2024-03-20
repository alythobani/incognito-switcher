import { createContextMenuItems } from "./providers/contextMenus";
import { startTrackingWindowInfos } from "./providers/windowInfos";
import { setupCommands } from "./setup/setupCommands";
import { setupContextMenus } from "./setup/setupContextMenus";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";
import { logSuccess, logWarning } from "./utils/logger";

const runBackgroundScript = async (): Promise<void> => {
  logSuccess("Background script running!");

  await startTrackingWindowInfos();

  await createContextMenuItems();

  await verifyIncognitoAccess();

  setupMainAction();

  setupCommands();

  setupContextMenus();

  chrome.runtime.onSuspend.addListener(() => {
    logWarning("Background script suspended");
  });
};

void runBackgroundScript();
