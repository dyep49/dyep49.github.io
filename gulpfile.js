var gulp = require('./gulp')([
  'browser-sync',
  'html',
  'watch',
  'browserify',
  'vendor',
  'sass',
  'jshint'
])

gulp.task('default', ['html', 'sass', 'jshint', 'vendor', 'browserify', 'browser-sync', 'watch']);