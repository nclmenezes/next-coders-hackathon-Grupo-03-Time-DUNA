const webpack = require("webpack");
const WebpackMd5Hash = require("webpack-md5-hash");

module.exports = {
  plugins: [new WebpackMd5Hash()],
};
