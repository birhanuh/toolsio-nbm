const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    historyApiFallback: true,
    host: "testa.lvh.me",
    port: 3000,    
    allowedHosts: [
      '.lvh.me'
    ],
    overlay: {
     warnings: false,
     errors: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.SERVER_HOST': JSON.stringify('lvh.me:3000'),
      'process.env.SERVER_PROTOCOL': JSON.stringify('http://')
    })
  ]

})