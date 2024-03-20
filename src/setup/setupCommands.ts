import { switchIncognitoMode } from "../actions/commands/switchIncognitoMode";
import { convertToCallback } from "../utils/utils";

export function setupCommands(): void {
  chrome.commands.onCommand.addListener(convertToCallback(onCommand));
}

const onCommand = async (command: string, tab: chrome.tabs.Tab): Promise<void> => {
  switch (command) {
    case "switchIncognitoMode":
      await switchIncognitoMode(tab);
      break;
    default:
      console.error("Unknown command", command);
  }
};
