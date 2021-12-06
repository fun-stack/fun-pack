const Path = require("path");
const glob = require("glob")
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");

//TODO?!
const wd = Path.join(__dirname, "../../../..");

const devDir = Path.join(wd, "dev");
const rootPath = Path.resolve(wd, "../../../..");

function dev(argsRaw) {
  const args = Object.assign({
    indexHtml: "src/main/html/index.html",
    assetsDir: "assets",
    extraWatchDirs: []
  }, argsRaw);

  const indexHtml = Path.resolve(rootPath, args.indexHtml);
  const assetsDir = Path.join(rootPath, args.assetsDir);
  const extraWatchDirs = args.extraWatchDirs.map(path => Path.join(rootPath, path));

  const staticCopyFiles = [
    glob.sync(Path.join(wd, "*-fastopt-loader.js")),
    glob.sync(Path.join(wd, "*-fastopt.js")),
    glob.sync(Path.join(wd, "*-fastopt.js.map"))
  ].flat().map(path => Path.basename(path));

  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(false),
      }),
      new CleanPlugin(devDir),
      new HtmlWebpackPlugin({
        template: indexHtml,
      }),
      new CopyPlugin({
        patterns: staticCopyFiles.map((f) => {
          return {from: f, context: Path.dirname(f), force: true};
        }),
      }),
      new HtmlWebpackTagsPlugin({
        tags: staticCopyFiles.filter((name) => name.endsWith(".js")),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    devServer: {
      contentBase: [devDir, assetsDir].concat(extraWatchDirs),
      allowedHosts: [".localhost"],
      disableHostCheck: false,
      compress: false,
      watchContentBase: true,
      watchOptions: {
        ignored: (f) => f.endsWith(".tmp"),
      },
      // writeToDisk: true,
      hot: false,
      hotOnly: false,
      inline: true,
    },
    output: {path: devDir},
  })
};

module.exports = {webDev: dev};
