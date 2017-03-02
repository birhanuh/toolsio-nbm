import path from 'path'
import webpack from 'webpack'

export default {
  devtool : 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, './app/src/app.js')
  ],  
  output: {
    path: __dirname + '/public/build/',
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        //include: [
        //  path.join(__dirname, '/app/src'),
        //  path.join(__dirname, '/app/routes')
        //]
        loaders: [ 'react-hot', 'babel' ],
      }
    ]
  },
  resolve: {
    extentions: ['', '.js'] 
  }
}  