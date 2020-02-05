// Set favicon
function updateExtensionIcon(e) {
    const type = e.matches ? "light" : "dark";
    chrome.runtime.sendMessage({ type: "update-icon" }); // Only works if this page is open, but still, better than nothing.
}
const mql = window.matchMedia("(prefers-color-scheme: dark)");
mql.onchange = updateExtensionIcon;
updateExtensionIcon(mql);

chrome.tabs.update({ url: "chrome-search://local-ntp/local-ntp.html", active: !0, selected: !0 })