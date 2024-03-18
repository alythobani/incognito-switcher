import { startSortedWindowsInstance } from "./providers/sortedWindows";
import { setupContextMenus } from "./setup/contextMenus/setupContextMenus";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";

void startSortedWindowsInstance();

verifyIncognitoAccess();

setupMainAction();

setupContextMenus();
