const path = require('path');
module.exports = {
  entry: {
    iris: './src/demo/iris.js',
    candlestick: './src/demo/candlestick.js',
    occurrence: './src/demo/occurrence.js',
    boxplot: './src/demo/boxplot.js',
    chords: './src/demo/chords.js'
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
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
          plugins: [
            ['transform-runtime', {
              helpers: false,
              polyfill: false,
              regenerator: true,
            }]
          ],
        }
      }
    }]
  }
};