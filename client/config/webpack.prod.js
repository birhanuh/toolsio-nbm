const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.CLIENT_URL': JSON.stringify('toolsio.com'),
      'process.env.CLIENT_PROTOCOL': JSON.stringify('https://'),
      'process.env.SERVER_URL': JSON.stringify('localhost:8080')
    })
  ]

})