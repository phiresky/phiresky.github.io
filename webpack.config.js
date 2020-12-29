const path = require("path");

module.exports = {
  mode: "production",
  entry: "./lazy.tsx",
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "lazy.min.js",
    path: path.resolve(__dirname),
  },
};
