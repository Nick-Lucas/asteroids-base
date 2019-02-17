const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: "production",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  devtool: "eval",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};