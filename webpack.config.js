const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js",
    publicPath: process.env.VUE_APP_URL_PUBLICPATH,        
  },
  devServer: {
    historyApiFallback: true
  }
};
