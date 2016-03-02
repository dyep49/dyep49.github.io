const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const projects = require('./data/projects.json');
const skills = require('./data/skills.json');
const jadeObj = Object.assign({}, skills, projects);
const jadeData = JSON.stringify({obj: jadeObj});

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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
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
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000'
      },
      {
        test: /\.gif$/,
        loader: 'file'
      }
    ],
    eslint: {
      configFile: '/.eslintrc'
    }
  }
};
