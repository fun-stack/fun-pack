const Path = require("path");
const CleanPlugin = require("webpack-cleanup-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {merge} = require("webpack-merge");

//TODO?!
const wd = Path.join(__dirname, "../../../..");

const rootPath = Path.resolve(wd, "../../../..");
const distDir = Path.join(wd, "dev");

function dev() {
  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new CleanPlugin(),
      // to analyze bundle size, have a look at these:
      // new BundleAnalyzerPlugin({analyzerMode: "server"}),
      // https://www.npmjs.com/package/source-map-explorer
    ],
    optimization: {
      minimize: false,
    },
    target: 'node',
    output: {
      path: distDir,
      filename: "main.js",
      libraryTarget: 'umd'
    },
  });
}

module.exports = {lambdaDev: dev};
