const path = require("path")

const { merge } = require("webpack-merge")
const common = require("./config.common.js")

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "../dist"),
    watchFiles: ["src/**/*"],
  },
})
