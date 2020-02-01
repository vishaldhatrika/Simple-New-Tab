const gulp = require("gulp");
const webpack = require("webpack-stream");
const fs = require("fs");

const IN_DIR = "./src";
const OUT_DIR = "./build";

fs.mkdir(OUT_DIR, (err) => {
    if (err & err.code != "EEXIST") throw err;
});

function main(cb) {
    // Bring over the HTML
    gulp.src(IN_DIR + "/index.html")
        .pipe(gulp.dest(OUT_DIR));
    // Bring over the JS files as well except index.js, that's handled by webpack
    gulp.src(IN_DIR + "/js/bg.js")
        .pipe(gulp.dest(OUT_DIR + "/js/"));
    gulp.src(IN_DIR + "/js/config.json")
        .pipe(gulp.dest(OUT_DIR + "/js/"));
    cb();
}

// This invokes webpack which is configured in webpack.config.js
function packing() {
    return gulp.src(OUT_DIR)
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest(OUT_DIR));
}

// This takes care of assets (icons)
function assets(cb) {
    gulp.src(IN_DIR + "/icons/*")
        .pipe(gulp.dest(OUT_DIR + "/icons/"));
    cb();
}

// Manifest file for the extension
function manifest(cb) {
    gulp.src(IN_DIR + "/manifest.json")
        .pipe(gulp.dest(OUT_DIR));
    cb();
}

// Translations
function locales(cb) {
    gulp.src(IN_DIR + "/_locales/**/*")
        .pipe(gulp.dest(OUT_DIR + "/_locales/"));
    cb();
}

exports.default = gulp.series(main, packing, gulp.parallel(assets, manifest, locales));