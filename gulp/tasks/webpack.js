const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackConfig = require('../../webpack.config.js');

module.exports = function() {
  gulp.task('webpack', function() {
    return gulp.src('src/scripts/app.js')
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('build/'));   
  })
}
