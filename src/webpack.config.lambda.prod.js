const Path = require("path");
const FsPlugin = require("fs-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {merge} = require("webpack-merge");

const wd = Path.resolve(Path.dirname(module.parent.parent.filename));

const rootPath = Path.resolve(wd, "../../../..");
const distDir = Path.join(wd, "dist");

function prod() {
  process.env.NODE_ENV = "production";

  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    mode: "production",
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new FsPlugin([{
        type: 'delete',
        files: distDir
      }]),
      // to analyze bundle size, have a look at these:
      // new BundleAnalyzerPlugin({analyzerMode: "server"}),
      // https://www.npmjs.com/package/source-map-explorer
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            // https://github.com/node-fetch/node-fetch/issues/784
            // Needed to use node-fetch backend of sttp
            keep_classnames: /AbortSignal/,
            keep_fnames: /AbortSignal/,
          },
        }),
      ],
    },
    target: 'node',
    output: {
      path: distDir,
      filename: "main.js",
      libraryTarget: 'umd'
    },
  });
}

module.exports = {lambdaProd: prod};
