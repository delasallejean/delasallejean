'use strict';

let gulp = require('gulp');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let uglify = require('gulp-uglify');
let streamify = require('gulp-streamify');

let PATHS = {
    entries: 'jsx/index.jsx',
    jsx: ['jsx/*.jsx', 'jsx/**/*.jsx'],
    destination: 'build'
};

gulp.task('build', function () {
    browserify({
        entries: PATHS.entries,
        extensions: ['.jsx'],
        debug: true
    })
        .transform(babelify.configure({
            presets: ['react', 'es2015']
        }))
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(PATHS.destination));
});


gulp.task('watch', () => {
    gulp.watch(PATHS.jsx, ['build']);
});