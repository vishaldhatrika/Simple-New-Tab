// Set title
document.title = chrome.i18n.getMessage("tabTitle");

const today = new Date(Date.now());

chrome.storage.local.get(["lastDate"], function(comparisonDate) {
    if (today.getDate !== comparisonDate.getDate) {
        chrome.runtime.sendMessage({ type: "update-wallpaper" });
    }
});

// Set favicon
function updateFavicon(e) {
    const type = e.matches ? "light" : "dark";
    document.querySelector("link[rel=\"shortcut icon\"]").href = `icons/tab-${type}-32.png`;
    chrome.runtime.sendMessage({ type: "update-icon" }); // Only works if this page is open, but still, better than nothing.
}
const mql = window.matchMedia("(prefers-color-scheme: dark)");
mql.onchange = updateFavicon;
updateFavicon(mql);
