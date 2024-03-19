import { startSortedWindowsInstance } from "./providers/sortedWindows";
import { setupCommands } from "./setup/setupCommands";
import { setupContextMenus } from "./setup/setupContextMenus";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";

void startSortedWindowsInstance();

verifyIncognitoAccess();

setupMainAction();

setupCommands();

setupContextMenus();
