const path = require('path');

module.exports = {
  entry: [
    './src/scripts/app'
  ],
  output: {
    path: path.join(__dirname, './'),
    filename: 'dist/dist_bundle.js'
  },
  plugins: require('./webpack/common-plugins.js'),
  module: require('./webpack/module.js')
};
