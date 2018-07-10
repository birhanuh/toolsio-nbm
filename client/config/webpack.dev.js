const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

// env
require('dotenv').config()

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
      'process.env.CLIENT_URL': JSON.stringify('lvh.me:3000'),
      'process.env.CLIENT_PROTOCOL': JSON.stringify('http://'),
      'process.env.SERVER_URL': JSON.stringify('localhost:8080'),
      'process.env.JWTSECRET1': JSON.stringify(process.env.JWTSECRET1),
      'process.env.JWTSECRET2': JSON.stringify(process.env.JWTSECRET2),
      'process.env.CLOUDINARY_API_URL_IMAGE': JSON.stringify(process.env.CLOUDINARY_API_URL_IMAGE),
      'process.env.CLOUDINARY_API_URL_SPRITE': JSON.stringify(process.env.CLOUDINARY_API_URL_SPRITE),
      'process.env.CLOUDINARY_PRESET_AVATARS': JSON.stringify(process.env.CLOUDINARY_PRESET_AVATARS),
      'process.env.CLOUDINARY_PRESET_LOGOS': JSON.stringify(process.env.CLOUDINARY_PRESET_LOGOS)
    })
  ]

})