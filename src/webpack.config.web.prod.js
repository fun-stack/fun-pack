const Path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const {merge} = require("webpack-merge");

//TODO?!
const wd = Path.join(__dirname, "../../..");

const rootPath = Path.resolve(wd, "../../../..");
const distDir = Path.join(wd, "dist");

function prod(argsRaw) {
  const args = Object.assign({
    indexHtml: "src/main/html/index.html",
    assetsDir: "assets"
  }, argsRaw);

  const indexHtml = Path.resolve(rootPath, args.indexHtml);
  const assetsDir = Path.join(rootPath, args.assetsDir);

  process.env.NODE_ENV = "production";

  return merge(require(Path.resolve(wd, "scalajs.webpack.config")), {
    mode: "production",
    resolve: {
      modules: [rootPath, Path.join(wd, "node_modules")],
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
      }),
      new CleanPlugin(distDir),
      new HtmlWebpackPlugin({
        template: indexHtml,
      }),
      new CopyPlugin({
        patterns: [{from: "**/*", context: assetsDir}],
      }),
      new MiniCssExtractPlugin({
        filename: "main-[contenthash]-hashed.css",
      }),
      new SriPlugin({
        hashFuncNames: ["sha256"],
        enabled: process.env.NODE_ENV === "production",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        extractComments: false,
      }), new CssMinimizerPlugin()],
    },
    output: {
      path: distDir,
      filename: "main-[contenthash]-hashed.js",
      crossOriginLoading: "anonymous",
    },
  });
}

module.exports = {webProd: prod};
