import { startTrackingWindowInfos } from "./providers/sortedWindows";
import { setupCommands } from "./setup/setupCommands";
import { setupContextMenus } from "./setup/setupContextMenus";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";
import { log } from "./utils/logger";

log("Background script running!");

void startTrackingWindowInfos();

verifyIncognitoAccess();

setupMainAction();

setupCommands();

setupContextMenus();

chrome.runtime.onSuspend.addListener(() => {
  log("Background script suspended");
});
