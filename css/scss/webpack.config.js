var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  resolve:{
      modules: ["node_modules"],
      extensions: ['.js', '.vue', '.scss', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test:/\.scss$/,
        use:[
          {
            loader:'style-loader'
          },
          {
            loader:'css-loader'
          },
          {
            loader:'sass-loader'
          }
        ]
      }
    ]
  }
};