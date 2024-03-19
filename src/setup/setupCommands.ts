import { switchIncognitoMode } from "../actions/commands/switchIncognitoMode";

export function setupCommands(): void {
  chrome.commands.onCommand.addListener((command, tab) => {
    switch (command) {
      case "switchIncognitoMode":
        void switchIncognitoMode(tab);
        break;
      default:
        console.error("Unknown command", command);
    }
  });
}
