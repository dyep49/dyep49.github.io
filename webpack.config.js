const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3333',
    './src/scripts/app'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  externals: {
    "jquery": "jQuery"
  },
  devServer: {
    inline: true,
    port: 3333
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/, 
        loaders: ['eslint'],
        exclude: /(node_modules)|(\/src\/scripts\/vendor)/,
      }
    ],
    loaders: [
      {
        test: /\.js/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        include: /src/,
        exclude: /node_modules/,
        loaders: [
          'style',
          'css',
          'sass?outputStyle=expanded'
        ]
      }
    ],
    eslint: {
      configFile: '/.eslintrc'
    }
  }
};
