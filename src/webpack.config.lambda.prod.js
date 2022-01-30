const Path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {merge} = require("webpack-merge");

//TODO?!
const wd = Path.join(__dirname, "../../../..");
process.chdir(wd);

const rootPath = Path.resolve(wd, "../../../..");
const distDirRelative = "dist";
const distDir = Path.join(wd, distDirRelative);

function prod() {
  process.env.NODE_ENV = "production";

  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    mode: "production",
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
