const gulp = require("gulp");
const webpack = require("webpack-stream");
const fs = require("fs");
const sass = require("gulp-sass");

const IN_DIR = "./src";
const OUT_DIR = "./build";

sass.compiler = require("node-sass");

fs.mkdir(OUT_DIR, (err) => {
    if (err !== null && err.code !== "EEXIST") {
        console.error(err);
    }
});

function main(cb) {
    // Bring over the HTML
    gulp.src(IN_DIR + "/*.html")
        .pipe(gulp.dest(OUT_DIR));
    // Bring over the JS files
    gulp.src(IN_DIR + "/js/*.js")
        .pipe(gulp.dest(OUT_DIR + "/js/"));
    gulp.src(IN_DIR + "/js/config.json")
        .pipe(gulp.dest(OUT_DIR + "/js/"));
    cb();
}

function css(cb) {
    gulp.src(IN_DIR + "/css/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(OUT_DIR + "/css/"));
    cb();
}

// This invokes webpack which is configured in webpack.config.js
function packing(cb) {
    gulp.src(OUT_DIR)
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest(OUT_DIR + "/js/"));
    cb();
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

exports.default = gulp.parallel(main, packing, assets, manifest, locales, css);