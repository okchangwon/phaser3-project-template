const merge = require("webpack-merge");
const path = require("path");
const prod = require("./prod");

module.exports = merge(prod, {
  mode: "production",
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(process.cwd(), "www"),	// 결과 기준 폴더
  }
});
