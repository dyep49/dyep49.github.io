var gulp = require('gulp');
var htmlMin = require('gulp-htmlmin');
var mustache = require('gulp-mustache');
var data = require('./../../data/projects.json');

module.exports = function() {
  gulp.task('html', function() {
    gulp.src(['./src/index.html'])
      .pipe(mustache(data))
      .pipe(htmlMin({collapseWhitespace: true}))
      .pipe(gulp.dest('./'))
  });  
};
