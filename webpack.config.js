/**
 * Bundle config
 */

var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

  entry: {
    'bundle': './src/assets/js/main.js',
    // 'app': './src/assets/js/main.js'
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/build',
    library: 'mb'
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: 1,
              importLoaders: 1
            }
          },
          'postcss-loader'
        ])
      },
      {
        test: /\.js$/,
        use : [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ]
      }
    ]
  },

  plugins: [

    // new webpack.optimize.UglifyJsPlugin(),

    // new webpack.NoEmitOnErrorsPlugin(),

    new ExtractTextPlugin('./bundle.css')

  ],

  devtool: 'source-map',

  watch: true,
  watchOptions: {
    aggregateTimeout: 50
  }
}