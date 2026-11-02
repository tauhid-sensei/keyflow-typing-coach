// KeyFlow cross-browser toolbar action.
// Chromium Manifest V3 uses chrome.action; Firefox Manifest V2 uses browser_action.
// The extension page itself is packaged locally and does not need a web server.
const actionApi = (typeof browser !== "undefined" && browser.browserAction)
  ? browser.browserAction
  : (chrome.action || chrome.browserAction);

if (actionApi && actionApi.onClicked) {
  actionApi.onClicked.addListener(() => {
    const url = (typeof browser !== "undefined" && browser.runtime)
      ? browser.runtime.getURL("app/index.html")
      : chrome.runtime.getURL("app/index.html");
    const tabsApi = (typeof browser !== "undefined" && browser.tabs) ? browser.tabs : chrome.tabs;
    tabsApi.create({ url });
  });
}

// Show a one-time pinning guide after installation/update. Browsers do not permit
// extensions to pin themselves to the toolbar programmatically.
const runtimeApi = (typeof browser !== "undefined" && browser.runtime) ? browser.runtime : chrome.runtime;
if (runtimeApi && runtimeApi.onInstalled) {
  runtimeApi.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      const tabsApi = (typeof browser !== "undefined" && browser.tabs) ? browser.tabs : chrome.tabs;
      const welcomeUrl = runtimeApi.getURL("app/index.html?welcome=pin");
      if (tabsApi && tabsApi.create) tabsApi.create({ url: welcomeUrl });
    }
  });
}
