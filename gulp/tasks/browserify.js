var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var deamdify = require('deamdify');
var libs = require('../utils/libs.js');
var uglify = require('gulp-uglify');
var gStreamify = require('gulp-streamify');
var size = require('gulp-size');
var reload = require('browser-sync').reload;

module.exports = function() {
  gulp.task('browserify', function() {
    var opts = {
      entries: ['./src/scripts/app.js'],
      debug: true
    }

    var bundle = browserify(opts)
      .transform({global: true}, deamdify)
      .transform('browserify-shim');

    libs.forEach(function(lib) {
      bundle.external(lib)
    })

    return bundle
      .bundle()
      .pipe(source('app.js'))
      .pipe((gStreamify(uglify())))
      .pipe(gulp.dest('./build/scripts'))
      .pipe(reload({stream: true}))
      .pipe((gStreamify(size())))
      
  })
}
