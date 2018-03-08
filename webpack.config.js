const path = require('path');
module.exports = {
  entry: {
    iris: './src/demo/iris.js',
    candlestick: './src/demo/candlestick.js',
    occurrence: './src/demo/occurrence.js',
    boxplot: './src/demo/boxplot.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }]
  }
};