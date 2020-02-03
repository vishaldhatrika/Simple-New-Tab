const path = require("path");
const outputDir = path.resolve(__dirname, "/build/js/");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src/js/"),
    output: {
        path: outputDir,
        filename: "bg.js",
    },
};