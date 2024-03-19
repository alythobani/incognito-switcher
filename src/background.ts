import { startSortedWindowsInstance } from "./providers/sortedWindows";
import { setupContextMenus } from "./setup/contextMenus/setupContextMenus";
import { setupCommands } from "./setup/setupCommands";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";

void startSortedWindowsInstance();

verifyIncognitoAccess();

setupMainAction();

setupCommands();

setupContextMenus();
