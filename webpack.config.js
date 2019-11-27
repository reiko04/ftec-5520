const path = require('path');
var webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/borrower.html', to: "borrower.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/login.html', to: "login.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/signup.html', to: "signup.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/lender.html', to: "lender.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/borrowtransaction.html', to: "borrowtransaction.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/borrow-form.html', to: "borrow-form.html" }
    ]),
    new CopyWebpackPlugin([
      { from: './app/templates/lend-form.html', to: "lend-form.html" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.js$/,
        include: [
          /\/mongoose\//i,
          /\/kareem\//i
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ],
  },
  node: {
    // Replace these Node.js native modules with empty objects, Mongoose's
    // browser library does not use them.
    // See https://webpack.js.org/configuration/node/
    dns: 'empty',
    fs: 'empty',
    'module': 'empty',
    net: 'empty',
    tls: 'empty'
  },
  target: 'web'
}
