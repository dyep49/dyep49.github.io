const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./../../webpack.config.js');

module.exports = function() {
  gulp.task('webpack-dev-server', function() {
    new WebpackDevServer(webpack(webpackConfig), {
      stats: {
        colors: true
      },
      hot: true,
    }).listen(webpackConfig.devServer.port, '0.0.0.0', function(err) {
      if(err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://localhost:3333/index.html');
    });
  })
}
