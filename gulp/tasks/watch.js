var gulp = require('gulp');

module.exports = function() {
  
  gulp.watch(['./src/**/*.js'], ['browserify', 'jshint'])

  gulp.watch('./src/**/*.scss', ['sass']);

  gulp.watch(['./src/index.html', './data/projects.json'], ['html']);
}