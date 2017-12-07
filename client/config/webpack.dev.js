const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,    
    allowedHosts: [
      '.lvh.me'
    ],
    proxy: {
     '/**': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html"
          }
        }
     },
    },
    overlay: {
     warnings: false,
     errors: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]

})