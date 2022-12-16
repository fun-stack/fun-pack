const {baseConfig} = require("./webpack.base.js");
const Path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const {SubresourceIntegrityPlugin} = require("webpack-subresource-integrity");

const {merge} = require("webpack-merge");

const wd = Path.resolve(Path.dirname(module.parent.parent.filename));

const isScalaJsBundler = wd.includes("scalajs-bundler") && wd.includes("main");
const relativeCorrection = isScalaJsBundler ? "../../../.." : ".";
const rootPath = Path.resolve(wd, relativeCorrection);

function prod(argsRaw) {
  const args = Object.assign({
    entrypoint: null,
    outputDir: "dist",
    indexHtml: null,
    assetsDir: null
  }, argsRaw);

  const outputDir = Path.join(wd, args.outputDir);
  const indexHtml = args.indexHtml ? Path.resolve(rootPath, args.indexHtml) : null;
  const assetsDir = args.assetsDir ? Path.join(rootPath, args.assetsDir) : null;

  process.env.NODE_ENV = "production";

  return merge(baseConfig(wd, args.entrypoint), {
    mode: "production",
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
      }),
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
      new SubresourceIntegrityPlugin({
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
      path: outputDir,
      filename: "main-[contenthash]-hashed.js",
      crossOriginLoading: "anonymous",
      clean: true,
    },
  });
}

module.exports = {webProd: prod};
