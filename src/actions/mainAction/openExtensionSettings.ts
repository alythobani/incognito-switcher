import { getExtensionSettingsURL } from "../../utils/chromeUtils";
import { createNewTab } from "../tabActions/createNewTab";

export const openExtensionSettings = async (): Promise<void> => {
  await createNewTab({ url: getExtensionSettingsURL(), mode: "normal" });
};
