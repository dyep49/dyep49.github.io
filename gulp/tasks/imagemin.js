var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var size = require('gulp-size');

module.exports = function() {
  gulp.task('imagemin', function() {
    gulp.src('./src/img/*.jpg')
      .pipe(imagemin({
        progressive: true,
        use: [jpegtran()]
      }))
      .pipe(gulp.dest('build/img/'))
      .pipe(size())
  })
}