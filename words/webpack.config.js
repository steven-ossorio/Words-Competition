let path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  entry: "./index.js",
  module: {
      rules: [
          {
              test: [/\.jsx?$/, /\.js?$/],
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['react', 'env']
                }
              }
          }, {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    }
      ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
  output: {
      path: __dirname + "/src/javascripts",
      filename: "build.js"
  }
};