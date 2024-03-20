import { onSwitchIncognitoMode } from "../actions/commands/switchIncognitoMode";
import { log } from "../utils/logger";
import { convertToCallback } from "../utils/utils";

export function setupCommands(): void {
  chrome.commands.onCommand.addListener(convertToCallback(onCommand));
}

const onCommand = async (command: string, tab: chrome.tabs.Tab): Promise<void> => {
  log(`Command "${command} called`, tab.url, tab.incognito);
  switch (command) {
    case "switchIncognitoMode":
      await onSwitchIncognitoMode(tab);
      break;
    default:
      console.error("Unknown command", command);
  }
};
