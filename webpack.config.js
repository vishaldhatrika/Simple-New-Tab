const path = require("path");
const outputDir = path.resolve(__dirname, "/build/js/");

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "src/js/"),
    output: {
        path: outputDir,
        filename: "index.js",
    },
};