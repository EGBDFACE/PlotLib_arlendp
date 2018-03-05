const path = require('path');
module.exports = {
  entry: './src/demo/iris.js',
  output: {
    path: __dirname + '/dist',
    filename: 'plot.bundle.js'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};