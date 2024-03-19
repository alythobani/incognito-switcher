import { onMainCommand } from "../actions/commands/mainCommand";

export function setupCommands(): void {
  chrome.commands.onCommand.addListener((command, tab) => {
    switch (command) {
      case "mainCommand":
        void onMainCommand(tab);
        break;
      default:
        console.error("Unknown command", command);
    }
  });
}
