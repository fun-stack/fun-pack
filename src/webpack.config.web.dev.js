const Path = require("path");
const glob = require("glob")
const CopyPlugin = require("copy-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");

//TODO?!
const wd = Path.join(__dirname, "../../..");

const devDir = Path.join(wd, "dev");
const rootPath = Path.resolve(wd, "../../../..");
const assetsDir = Path.join(rootPath, "assets");

function dev(extraWatchDirsArgs) {
  const extraWatchDirs = (extraWatchDirsArgs || []).map(path => Path.join(wd, path));
  const staticCopyFiles = [
    glob.sync(Path.join(wd, "*-fastopt-loader.js")),
    glob.sync(Path.join(wd, "*-fastopt.js")),
    glob.sync(Path.join(wd, "*-fastopt.js.map"))
  ].flat().map(path => Path.basename(path));

  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    plugins: [
      new HtmlWebpackPlugin({
        template: Path.resolve(rootPath, "src/main/html/index.html"),
      }),
      new CleanPlugin(devDir),
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
