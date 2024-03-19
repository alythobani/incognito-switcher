import { onMainAction } from "../actions/mainAction";
import { convertToCallback } from "../utils/utils";

export function setupMainAction(): void {
  chrome.action.onClicked.addListener(convertToCallback(onMainAction));
}
