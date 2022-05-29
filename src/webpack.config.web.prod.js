const {baseConfig} = require("./webpack.base.js");
const Path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const {merge} = require("webpack-merge");

const wd = Path.resolve(Path.dirname(module.parent.parent.filename));

const isScalaJsBundler = wd.includes("scalajs-bundler") && wd.includes("main");
const relativeCorrection = isScalaJsBundler ? "../../../.." : ".";
const rootPath = Path.resolve(wd, relativeCorrection);
const distDir = Path.join(wd, "dist");

function prod(argsRaw) {
  const args = Object.assign({
    entrypoint: null,
    indexHtml: null,
    assetsDir: null
  }, argsRaw);

  const indexHtml = args.indexHtml ? Path.resolve(rootPath, args.indexHtml) : null;
  const assetsDir = args.assetsDir ? Path.join(rootPath, args.assetsDir) : null;

  process.env.NODE_ENV = "production";

  return merge(baseConfig(wd, args.entrypoint), {
    node: false, //disable automatic node polyfills from webpack 4, webpack 5 has this disabled by default.
    mode: "production",
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
      }),
      new CleanWebpackPlugin(),
    ].concat(
      indexHtml ? [
        new HtmlWebpackPlugin({
          template: indexHtml
        })
      ] : []
    ).concat(
      assetsDir ? [
        new CopyPlugin({
          patterns: [{from: "**/*", context: assetsDir}],
        })
      ] : []
    ).concat([
      new MiniCssExtractPlugin({
        filename: "main-[contenthash]-hashed.css",
      }),
      new SriPlugin({
        hashFuncNames: ["sha256"],
        enabled: process.env.NODE_ENV === "production",
      }),
    ]),
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
