var gulp = require('gulp');
var mustache = require('gulp-mustache');
var data = require('./../../data/projects.json');

module.exports = function() {
  gulp.task('mustache', function() {
    gulp.src('src/index.html')
      .pipe(mustache(data))
      .pipe(gulp.dest('./'));
  });

};
