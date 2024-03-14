# Incognito Switcher

A chrome extension to switch current tab or link from incognito window to normal window, or vice versa.

Forked from [Incognito or Not](https://github.com/spyth/Incognito-or-not/tree/master) by [spyth](https://github.com/spyth) for the sake of adding some more features/code I wanted (e.g. switch to the last focused window of the right type, use TypeScript) and experimenting around with extension development.

# How to develop and run locally

1. Clone this repository by running the following command in your terminal, in a folder you would like to have the repo live under:
   ```bash
   cd your-projects-folder
   git clone git@github.com:alythobani/incognito-switcher.git
   ```
2. Navigate to the cloned repository's directory; install the project dependencies and TypeScript globally; then compile the project's TypeScript files in watch mode:
   ```bash
   cd incognito-switcher
   npm install
   npm run watch
   ```
   (This compiles the TS files in `src/` into JS files in `/dist/js`.)
3. Open your Chrome browser and navigate to the Extensions page by entering chrome://extensions/ in the address bar.
4. Enable Developer Mode (toggle switch in the top right of the Extensions page).
5. Click "Load unpacked" in the top left corner of the page, and select the `dist` folder of your cloned repo

Incognito Switcher should now appear in your list of extensions! Make sure it is enabled, and that it's allowed to run in Incognito (within its settings page).

You can also set a keyboard shortcut for it if you'd like (e.g. `cmd-shift-I`), by clicking "Keyboard Shortcuts" in the left sidebar of the Extensions page.

With `npm run watch` running in the background, if you edit the TS files in `src`, they should automatically be re-compiled into the JS files in `dist`. To have those code changes reflected in your unpacked Incognito Switcher extension running in Chrome, you then just need to click the Refresh icon for Incognito Switcher in your Extensions page.

Happy switching :\)
