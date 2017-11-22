const path = require('path');
module.exports = {
  entry: './src/plot.js',
  // entry: './main.js',
  output: {
    path: __dirname + '/dist',
    // path: __dirname,
    filename: 'plot.js'
  },
  // devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [{
      test: path.join(__dirname, 'src'),
      loader: 'babel-loader'
    }]
  }
};