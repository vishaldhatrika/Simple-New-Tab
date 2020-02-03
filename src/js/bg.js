const Unsplash = require("unsplash-js").default;
const { appName, accessKey } = require("./config.json");

function isDarkMode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function setIcon(image) {
    const data = {
        path: {},
    };

    for (const size of [16, 32, 48, 96, 128]) {
        data.path[size] = `icons/${image}-${size}.png`;
    }

    chrome.browserAction.setIcon(data);
}

function updateIcon() {
    chrome.storage.local.get({ disabled: false }, function () {
        if (isDarkMode()) {
            setIcon("tab-light");
        } else {
            setIcon("tab-dark");
        }
    });
}

async function fetchWallpaper() {

    // Figure out if this needs to be called every time with the function
    const unsplash = new Unsplash({ accessKey: accessKey });

    const imageData = {
        imageUrl = "",
        description = "",
        textColor = "",
        attributionLink = ``,
    }

    unsplash.photos.getRandomPhoto({ featured: true })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {

            console.log("Image: " + responseData.urls.full);
            console.log("Image desc: " + responseData.description);
            console.log("Suggested text color: " + responseData.color);

            imageData.imageUrl = responseData.urls.full;
            imageData.description = responseData.description;
            imageData.textColor = responseData.color;

            console.log("User name: " + responseData.user.name);
            console.log("User link: " + responseData.user.links.html);
        
            const userFullName = responseData.user.name;
            const userLink = responseData.user.links.html;

            imageData.attributionLink = `Photo by <a href="${userLink}?utm_source=${appName}&utm_medium=referral">${userFullName}</a> on <a href="https://unsplash.com/?utm_source=${appName}&utm_medium=referral">Unsplash</a>`;

            return imageData;
        });
}

// Monitor changes in data, and setup everything again.
// TODO: Needs to be overhauled/scrapped to work with wallpapers
chrome.storage.onChanged.addListener(function (changes) {
    if (changes.disabled) {
        updateIcon();
    }
});

chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === "update-icon") {
        updateIcon();
    } else if (request.type === "change-wallpaper") {
        await fetchWallpaper();
    } else {
        return false;
    }
    // This tells the browser to keep sendResponse alive because we're sending
    // the response asynchronously.
    return true;
});

// 1st time setup
// TODO: Use chrome API instead
updateIcon();

chrome.runtime.onStartup.addListener(function () {
    updateIcon(); // Set dark/light icon...

    // This doesn't work yet in Chrome, but we'll put it here anyway, in case it starts working...
    const darkModeMql = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMql.onchange = updateIcon;
});

// Opens new tab when clicking the extension icon, we're prepending chrome because Chrome accepts that and Edge does too for some reason
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: "chrome://newtab" });
});

chrome.runtime.onInstalled.addListener(function() {
    const date = new Date(Date.now());

    chrome.storage.local.set({ lastDate: date }, function() {
        console.log("Date saved as " + date);
    })
})