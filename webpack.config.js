var bodypack = require('webpack')
var path = require('path')

module.exports = {

  entry: {
    app: './app/src/app.js'
  },

  output: {
    filename: 'app/public/build/bundle.js',
    sourceMapFilename: 'app/public/build/bundle.map'
  },

  devtool: '#source-map',

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}  