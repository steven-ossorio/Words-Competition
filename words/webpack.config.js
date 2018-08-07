let path = require("path");

module.exports = {
  context: path.join(__dirname, "src"),
  entry: "./index.js",
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["react", "env"]
          }
        }
      },
      {
        test: [/\.scss$/, /\.css$/],
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  },
  resolve: { extensions: [".js", ".jsx", ".sass"] },
  output: {
    path: __dirname + "/src/javascripts",
    filename: "build.js"
  }
};
