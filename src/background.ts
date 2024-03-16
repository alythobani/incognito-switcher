import { setupContextMenus } from "./setup/contextMenus/setupContextMenus";
import { setupMainAction } from "./setup/setupMainAction";
import { verifyIncognitoAccess } from "./setup/verifyIncognitoAccess";

verifyIncognitoAccess();

setupMainAction();

setupContextMenus();
