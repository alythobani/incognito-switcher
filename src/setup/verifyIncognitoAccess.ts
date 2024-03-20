import { openExtensionSettings } from "../actions/tabActions";

export const verifyIncognitoAccess = async (): Promise<void> => {
  const isAllowedAccess = await chrome.extension.isAllowedIncognitoAccess();
  if (isAllowedAccess) {
    return;
  }

  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "../icon/icon.png",
      title: "Enable Incognito Access",
      message:
        "Please enable incognito access for Incognito Switcher to work properly. Click here to adjust the settings.",
    },
    (notificationId) => {
      chrome.notifications.onClicked.addListener((clickedNotificationId) => {
        if (clickedNotificationId === notificationId) {
          void openExtensionSettings();
          chrome.notifications.clear(notificationId);
        }
      });
    }
  );
};
