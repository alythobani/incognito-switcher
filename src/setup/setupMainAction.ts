import { onMainAction } from "../actions/mainAction/mainAction";
import { convertToCallback } from "../utils/utils";

export function setupMainAction(): void {
  chrome.action.onClicked.addListener(convertToCallback(onMainAction));
}
