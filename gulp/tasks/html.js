var gulp = require('gulp');
var htmlMin = require('gulp-minify-html');
var mustache = require('gulp-mustache');
var data = require('./../../data/projects.json');
var reload = require('browser-sync').reload;

module.exports = function() {
  gulp.task('html', function() {
    gulp.src(['./src/index.html'])
      .pipe(mustache(data))
      .pipe(htmlMin({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(gulp.dest('./'))
      .pipe(reload({stream: true}));
  });  
};