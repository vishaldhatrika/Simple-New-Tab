// Redirect to fakebox new tab
chrome.tabs.update({ url: "chrome-search://local-ntp/local-ntp.html", active: true, selected: true });

// Set favicon
function updateExtensionIcon() {
    chrome.runtime.sendMessage({ type: "update-icon" }); // Only works if this page is open, but still, better than nothing.
}
const mql = window.matchMedia("(prefers-color-scheme: dark)");
mql.onchange = updateExtensionIcon;
updateExtensionIcon();