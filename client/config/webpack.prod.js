const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// env
const env = require('../env')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      'process.env.CLIENT_HOST': JSON.stringify(env.CLIENT_HOST),
      'process.env.CLIENT_PROTOCOL': JSON.stringify(env.CLIENT_PROTOCOL),
      'process.env.SERVER_HTTP_PROTOCOL': JSON.stringify(env.SERVER_HTTP_PROTOCOL),
      'process.env.SERVER_WS_PROTOCOL': JSON.stringify(env.SERVER_WS_PROTOCOL),
      'process.env.SERVER_HOST': JSON.stringify(env.SERVER_HOST),
      'process.env.JWTSECRET1': JSON.stringify(env.JWTSECRET1),
      'process.env.JWTSECRET2': JSON.stringify(env.JWTSECRET2),
      'process.env.CLOUDINARY_API_URL_IMAGE': JSON.stringify(env.CLOUDINARY_API_URL_IMAGE),
      'process.env.CLOUDINARY_API_URL_SPRITE': JSON.stringify(env.CLOUDINARY_API_URL_SPRITE),
      'process.env.CLOUDINARY_PRESET_AVATARS': JSON.stringify(env.CLOUDINARY_PRESET_AVATARS),
      'process.env.CLOUDINARY_PRESET_LOGOS': JSON.stringify(env.CLOUDINARY_PRESET_LOGOS)
    })
  ]

})