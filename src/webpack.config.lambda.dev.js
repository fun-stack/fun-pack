const Path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {merge} = require("webpack-merge");

//TODO?!
const wd = Path.join(__dirname, "../../../..");
process.chdir(wd);

const rootPath = Path.resolve(wd, "../../../..");
const distDirRelative = "dev";
const distDir = Path.join(wd, distDirRelative);

function dev() {
  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new CleanPlugin(distDirRelative),
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
