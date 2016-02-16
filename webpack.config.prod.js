const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const jadeData = JSON.stringify({obj: require('./data/projects.json')});

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-dev-server/client?http://localhost:3333',
    './src/scripts/app'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dist_bundle.js'
  },
  devServer: {
    inline: true,
    port: 3333
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: 'apply?' + jadeData + '!jade-loader!./src/index.jade',
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
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
      },
      {
        test: /\.jade$/,
        loader: 'jade',
        include: /(src\/views)|(src\/scripts)/,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json',
        include: /data/
      }
    ],
    eslint: {
      configFile: '/.eslintrc'
    }
  }
};
