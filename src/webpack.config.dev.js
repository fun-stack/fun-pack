const Path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");

const devDir = Path.join(__dirname, "dev");
const rootPath = Path.resolve(__dirname, "../../../..");
const assetsDir = Path.join(rootPath, "assets");

export function dev({sbtProjectName, terraformModuleName}) {
  const terraformServeDir = Path.join(rootPath, `../terraform/.terraform/modules/${terraformModuleName}/serve`);
  const staticCopyFiles = [
    `${sbtProjectName}-fastopt-loader.js`,
    `${sbtProjectName}-fastopt.js`,
    `${sbtProjectName}-fastopt.js.map`,
  ];

  return merge(require("./scalajs.webpack.config"), {
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
      contentBase: [devDir, assetsDir, terraformServeDir],
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
