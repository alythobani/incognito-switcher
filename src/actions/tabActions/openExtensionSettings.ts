import { getExtensionSettingsURL } from "../../utils/chromeUtils";
import { createTabInLastFocusedWindowOfMode } from "./createTabInLastFocusedWindow";

export const openExtensionSettings = async (): Promise<void> => {
  await createTabInLastFocusedWindowOfMode({ url: getExtensionSettingsURL(), mode: "normal" });
};
