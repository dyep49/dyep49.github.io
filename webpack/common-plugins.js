const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projects = require('./../data/projects.json');
const skills = require('./../data/skills.json');
const jadeObj = Object.assign({}, skills, projects);
const jadeData = JSON.stringify({obj: jadeObj});

module.exports = [
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin(),
  new HtmlWebpackPlugin({
    template: 'apply?' + jadeData + '!jade-loader!./src/index.jade',
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
] 
