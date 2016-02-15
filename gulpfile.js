var gulp = require('./gulp')([
  'browser-sync',
  'html',
  'watch',
  'browserify',
  'vendor',
  'jshint',
  'imagemin',
  'webpack-dev-server',
  'webpack'
])

gulp.task('default', ['html', 'sass', 'jshint', 'vendor', 'browserify', 'browser-sync', 'watch']);
