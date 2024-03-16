export const verifyIncognitoAccess = (): void => {
  chrome.extension.isAllowedIncognitoAccess((isAllowedAccess) => {
    if (isAllowedAccess) {
      return;
    }
    const enableAccessLink = `chrome://extensions/?id=${chrome.runtime.id}`;
    const message =
      "Please enable incognito access for Incognito Switcher to work properly. Click here to adjust the settings.";

    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "../icon/icon.png",
        title: "Enable Incognito Access",
        message,
      },
      (notificationId) => {
        chrome.notifications.onClicked.addListener((clickedNotificationId) => {
          if (clickedNotificationId === notificationId) {
            void chrome.tabs.create({ url: enableAccessLink });
            chrome.notifications.clear(notificationId);
          }
        });
      }
    );
  });
};
