const Unsplash = require("unsplash-js").default;
const { appName, accessKey } = require("./config.json");

const unsplash = new Unsplash({ accessKey: accessKey });

unsplash.photos.getRandomPhoto({ featured: true })
    .then((response) => {
        return response.json();
    })
    .then((responseData) => {
        console.log("Image: " + responseData.urls.full);
        console.log("Image: " + responseData.description);
        console.log("Suggested text color: " + responseData.color);
        console.log("User name: " + responseData.user.name);
        console.log("User link: " + responseData.user.links.html);
        const userFullName = responseData.user.name;
        const userLink = responseData.user.links.html;
        const attribLink = `Photo by <a href="${userLink}?utm_source=${appName}&utm_medium=referral">${userFullName}</a> on <a href="https://unsplash.com/?utm_source=${appName}&utm_medium=referral">Unsplash</a>`;
    });

// Set title
document.title = chrome.i18n.getMessage("tabTitle");

// Set favicon
function updateFavicon(e) {
    const type = e.matches ? "light" : "dark";
    document.querySelector("link[rel=\"shortcut icon\"]").href = `icons/tab-${type}-32.png`;
    chrome.runtime.sendMessage({ type: "update-icon" }); // Only works if this page is open, but still, better than nothing.
}
const mql = window.matchMedia("(prefers-color-scheme: dark)");
mql.onchange = updateFavicon;
updateFavicon(mql);
