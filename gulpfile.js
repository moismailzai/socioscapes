/*global require, pipe*/
'use strict';
var assign = require('lodash.assign'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    filesize = require('gulp-filesize'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify');

var customOpts = {
        entries: ['./src/main.js'],
        standalone: 'socioscapes',
        debug: true
    },
    opts = assign({}, watchify.args, customOpts),
b = watchify(browserify(opts));
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('js', bundle); // so you can run `gulp js` to build a file
function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('socioscapes.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./'));
}

  //                                //
 // Test builds on dev environment //
//                                //
gulp.task('jstest', bundletest); // so you can run `gulp jstest` to build the test file
function bundletest() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('test.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(gulp.dest('../socioscapes-www/js/'));
}
