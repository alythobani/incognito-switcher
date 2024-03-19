import { startTrackingWindowInfos } from "./providers/windowInfos";
import { setupCommands } from "./setup/setupCommands";
import { setupContextMenus } from "./setup/setupContextMenus";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";
import { logSuccess, logWarning } from "./utils/logger";

logSuccess("Background script running!");

void startTrackingWindowInfos();

verifyIncognitoAccess();

setupMainAction();

setupCommands();

setupContextMenus();

chrome.runtime.onSuspend.addListener(() => {
  logWarning("Background script suspended");
});
