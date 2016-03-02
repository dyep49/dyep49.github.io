const path = require('path');

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
  plugins: require('./webpack/common-plugins.js').concat(require('./webpack/dev-plugins.js')),
  module: require('./webpack/module.js')
};
