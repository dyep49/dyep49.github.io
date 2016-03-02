const path = require('path');

module.exports = {
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
      include: path.join(__dirname, './../src')
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
      test: /\.(gif|png|jpg)$/,
      loader: 'file?name=dist/img/[name].[ext]&url?limit=25000'
    }
  ],
  eslint: {
    configFile: './../.eslintrc'
  }
}
