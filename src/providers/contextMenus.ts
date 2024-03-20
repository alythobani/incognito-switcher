import { getAllContextMenuItems } from "../actions/contextMenus/contextMenus";
import { logError, logSuccess } from "../utils/logger";

/* Types */

type ContextMenuItem = Omit<chrome.contextMenus.CreateProperties, "onclick"> & {
  onClick: ContextMenuItemClickHandler | null;
};

export type ContextMenuItemClickHandler = (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => Promise<void>;

type ContextMenuItemById = Map<string, ContextMenuItem>;

/* Exports */

export async function getContextMenusProvider(): Promise<ContextMenusProvider> {
  return await ContextMenusProvider.getInstance();
}

export async function createContextMenuItems(): Promise<void> {
  await ContextMenusProvider.getInstance();
}

export async function getContextMenuItem(
  menuItemId: string | number
): Promise<ContextMenuItem | undefined> {
  const contextMenusProvider = await ContextMenusProvider.getInstance();
  return contextMenusProvider.getContextMenu(menuItemId);
}

/* Provider Class */

export class ContextMenusProvider {
  /* Private fields and methods */

  private static instance: ContextMenusProvider | null = null;
  private readonly contextMenuItemById: ContextMenuItemById;
  private readonly instanceId: number = Math.floor(Math.random() * 10000);

  private constructor(contextMenuItemById: ContextMenuItemById) {
    this.contextMenuItemById = contextMenuItemById;
  }

  /* Exposed methods */

  public static async getInstance(): Promise<ContextMenusProvider> {
    if (ContextMenusProvider.instance === null) {
      const contextMenuItemById = await initializeContextMenuItems();
      const newInstance = new ContextMenusProvider(contextMenuItemById);
      ContextMenusProvider.instance = newInstance;
      logSuccess(`${newInstance.getInstanceName()} created`);
    }
    return ContextMenusProvider.instance;
  }

  public getInstanceName(): string {
    return `ContextMenusProvider ${this.instanceId}`;
  }

  public getContextMenuById(): ContextMenuItemById {
    return this.contextMenuItemById;
  }

  public getContextMenu(menuItemId: string | number): ContextMenuItem | undefined {
    if (typeof menuItemId === "number") {
      logError(`Received number instead of string for menuItemId: ${menuItemId}`);
      return undefined;
    }
    return this.contextMenuItemById.get(menuItemId);
  }
}

/* Implementation */

const initializeContextMenuItems = async (): Promise<ContextMenuItemById> => {
  const allContextMenuItems = await getAllContextMenuItems();
  allContextMenuItems.forEach(createContextMenuItem);
  return new Map(allContextMenuItems.map((menuItem) => [menuItem.id, menuItem]));
};

const createContextMenuItem = (menuItem: ContextMenuItem): void => {
  // onClick is not actually a valid CreateProperty, and chrome.contextMenus.create will throw an error
  // if we pass it in
  const { onClick, ...rest } = menuItem;
  chrome.contextMenus.create(rest);
};
