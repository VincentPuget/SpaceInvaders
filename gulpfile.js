"use strict";
const gulp = require("gulp");
let sass = require("gulp-sass");
let browserSync = require("browser-sync");
let reload = browserSync.reload;
let gulpif = require("gulp-if");
let argv = require("yargs").argv;
let notify = require("gulp-notify");
let chalk = require("chalk");
let uglify = require("gulp-uglify");
let concat = require("gulp-concat");
let cleanCSS = require("gulp-clean-css");
let order = require("gulp-order");
let sourcemaps = require("gulp-sourcemaps");
let babel = require("gulp-babel");
let prod = !!argv.prod;

function onError(){
  return notify.onError({
    message: "Error: <%= error.message %>",
    title: "Error running something",
    sound: "Glass"
  });
}

let paths = {
  browserSyncServer: {
    proxy: "http://localhost:4422",
    port: "3000"
  },
  fonts: {
    src: [
      "_assets_/fonts/**/*"
    ],
    dest: "assets/fonts/"
  },
  images: {
    src: [
      "_assets_/images/**/*"
    ],
    dest: "assets/images/"
  },
  sass: {
    src: [
      "_assets_/scss/main.scss"
    ],
    srcWatch: "_assets_/scss/**/*.scss",
    dest: "assets/css/",
    name: "all.min.css"
  },
  sassVendor: {
    src: [
      ""
    ],
    dest: "assets/css/",
    name: "allVendor.min.css"
  },
  js: {
    src: [
      "_assets_/js/**/*.js"
    ],
    srcWatch: "_assets_/js/**/*.js",
    dest: "assets/js/",
    name: "all.min.js"
  },
  jsVendor: {
    src: [
      "bower_components/lodash/dist/lodash.min.js"
    ],
    dest: "assets/js/",
    name: "allVendor.min.js"
  },
  jsServiceWorker: {
    src: [
      "_assets_/js/sw.js"
    ],
    srcWatch: "_assets_/js/sw/js",
    dest: "assets/js/",
    name: "sw.min.js"
  },
  pug: {
    srcWatch: "views/**/*.pug"
  },
  manifest: {
    src: [
      "_assets_/manifest.json"
    ],
    dest: "assets/"
  },
  browserconfig: {
    src: [
      "_assets_/browserconfig.xml"
    ],
    dest: "assets/"
  }
};

gulp.task("browserSync", () => {
  process.stdout.write(chalk.magenta("browserSync\r\n"));
  browserSync({
    proxy: paths.browserSyncServer.proxy,
    port: paths.browserSyncServer.port,
    open: false
  });
});

gulp.task("fonts", () => {
  process.stdout.write(chalk.magenta("fonts  \r\n"));
  return gulp.src(paths.fonts.src)
  .pipe(gulp.dest(paths.fonts.dest));
});

gulp.task("sassVendor", () => {
  process.stdout.write(chalk.magenta("sassVendor  \r\n"));
  return gulp.src(paths.sassVendor.src)
    .pipe(sass({
      errLogToConsole: true
    }))
    .on("error", onError())
    .pipe(gulpif(!prod, cleanCSS()))
    .on("error", onError())
    .pipe(concat(paths.sassVendor.name))
    .pipe(gulp.dest(paths.sassVendor.dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task("sass", () => {
  process.stdout.write(chalk.magenta("sass  \r\n"));
  return gulp.src(paths.sass.src)
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(sass({
      errLogToConsole: true
    }))
    .on("error", onError())
    .pipe(gulpif(!prod, cleanCSS()))
    .on("error", onError())
    .pipe(concat(paths.sass.name))
    .pipe(gulpif(!prod, sourcemaps.write("../sourcemaps/css/")))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task("jsVendor", () => {
  process.stdout.write(chalk.magenta("jsVendor\r\n"));
  return gulp.src(paths.jsVendor.src)
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(order([
      "lodash.min.js",
      "*"
    ]))
    .pipe(concat(paths.jsVendor.name))
    .pipe(gulpif(!prod, sourcemaps.write("../sourcemaps/js/")))
    .pipe(gulp.dest(paths.jsVendor.dest))
    .pipe(reload({ stream: true }));
});

gulp.task("js", () => {
  process.stdout.write(chalk.magenta("js\r\n"));
  return gulp.src(paths.js.src)
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(order([
      "*"
    ]))
    .pipe(gulpif(prod, babel()))
    .on("error", onError())
    .pipe(concat(paths.js.name))
    .pipe(gulpif(prod, uglify()))
    .on("error", onError())
    .pipe(gulpif(!prod, sourcemaps.write("../sourcemaps/js/")))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(reload({ stream: true }));
});

gulp.task("jsServiceWorker", () => {
  process.stdout.write(chalk.magenta("jsServiceWorker\r\n"));
  return gulp.src(paths.jsServiceWorker.src)
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(gulpif(prod, babel()))
    .on("error", onError())
    .pipe(concat(paths.jsServiceWorker.name))
    .pipe(gulpif(prod, uglify()))
    .on("error", onError())
    .pipe(gulpif(!prod, sourcemaps.write("../sourcemaps/js/")))
    .pipe(gulp.dest(paths.jsServiceWorker.dest))
    .pipe(reload({ stream: true }));
});

gulp.task("pug", () => {
  process.stdout.write(chalk.magenta("pug\r\n"));
  return gulp.src(paths.pug.srcWatch)
  .pipe(reload({ stream: true }));
});

gulp.task("images", () => {
  process.stdout.write(chalk.magenta("images\r\n"));
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(reload({ stream: true }));
});

gulp.task("manifest", () => {
  process.stdout.write(chalk.magenta("manifest\r\n"));
  return gulp.src(paths.manifest.src)
    .pipe(gulp.dest(paths.manifest.dest))
    .pipe(reload({ stream: true }));
});

gulp.task("browserconfig", () => {
  process.stdout.write(chalk.magenta("browserconfig\r\n"));
  return gulp.src(paths.browserconfig.src)
    .pipe(gulp.dest(paths.browserconfig.dest))
    .pipe(reload({ stream: true }));
});

gulp.task("defineWatcher", (done) => {
  process.stdout.write(chalk.magenta("defineWatcher\r\n"));
  gulp.watch(paths.fonts.src, gulp.series("fonts"));
  gulp.watch(paths.images.src, gulp.series("images"));
  gulp.watch(paths.sass.srcWatch, gulp.series("sass"));
  gulp.watch(paths.js.srcWatch, gulp.series("js"));
  gulp.watch(paths.jsServiceWorker.srcWatch, gulp.series("jsServiceWorker"));
  gulp.watch(paths.pug.srcWatch, gulp.series("pug"));
  done();
});

function logEnv(){
  let envName = "dev";
  if(prod){
    envName = "prod";
  }
  process.stdout.write(chalk.green("|***************************************|\r\n"));
  process.stdout.write(chalk.green("|***************************************|\r\n"));
  process.stdout.write(chalk.yellow("| ENV : " + chalk.underline(envName) + " |\r\n"));
  process.stdout.write(chalk.green("|***************************************|\r\n"));
  process.stdout.write(chalk.green("|***************************************|\r\n"));
}

gulp.task("build", gulp.series("fonts", "images"/*, "sassVendor"*/, "sass", "jsVendor", "js", "jsServiceWorker", "manifest", "browserconfig" , function(done){
  process.stdout.write(chalk.magenta("build\r\n"));
  logEnv();
  done();
}));

gulp.task("watch", gulp.series("build", "defineWatcher", "browserSync", (done) => {
  process.stdout.write(chalk.magenta("watch\r\n"));
  done();
}));

gulp.task("default", gulp.series("watch", (done) => {
  process.stdout.write(chalk.magenta("watch\r\n"));
  done();
}));
