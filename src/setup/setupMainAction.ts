import { onMainAction } from "../actions/mainAction";
import { convertToForgettableCallback } from "../utils/utils";

export function setupMainAction(): void {
  chrome.action.onClicked.addListener(convertToForgettableCallback(onMainAction));
}
