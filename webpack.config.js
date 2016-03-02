const path = require('path');
const commonPlugins = require('./webpack/common-plugins.js');
const devPlugins = require('./webpack/dev-plugins.js');
const plugins = commonPlugins.concat(devPlugins);

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/scripts/app'
  ],
  output: {
    path: path.join(__dirname, '/dev'),
    filename: 'dist_bundle.js'
  },
  plugins: plugins,
  module: require('./webpack/module.js')
};
