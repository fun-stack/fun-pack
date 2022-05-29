const {baseConfig} = require("./webpack.base.js");
const Path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {merge} = require("webpack-merge");

const wd = Path.resolve(Path.dirname(module.parent.parent.filename));

const isScalaJsBundler = wd.includes("scalajs-bundler") && wd.includes("main");
const relativeCorrection = isScalaJsBundler ? "../../../.." : ".";
const rootPath = Path.resolve(wd, relativeCorrection);
const distDir = Path.join(wd, "dev");

function dev(argsRaw) {
  const args = Object.assign({
    entrypoint: null,
    assetsDir: null
  }, argsRaw);

  const assetsDir = args.assetsDir ? Path.join(rootPath, args.assetsDir) : null;

  return merge(baseConfig(wd, args.entrypoint), {
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new CleanWebpackPlugin(),
    ].concat(
      assetsDir ? [
        new CopyPlugin({
          patterns: [{from: "**/*", context: assetsDir}],
        })
      ] : []
    ).concat([
      // to analyze bundle size, have a look at these:
      // new BundleAnalyzerPlugin({analyzerMode: "server"}),
      // https://www.npmjs.com/package/source-map-explorer
    ]),
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
