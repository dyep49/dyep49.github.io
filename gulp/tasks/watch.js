var gulp = require('gulp');

module.exports = function() {
  
  gulp.watch(['./src/**/*.js'], ['browserify', 'jshint'])

  gulp.watch('./src/styles/**/*.scss', ['sass']);

  gulp.watch('./src/index.html', ['html']);
}