const Path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const {merge} = require("webpack-merge");

const rootPath = Path.resolve(__dirname, "../../../..");
const distDir = Path.join(__dirname, "dist");
const assetsDir = Path.join(rootPath, "assets");

export function prod() {
  process.env.NODE_ENV = "production";

  return merge(require("./scalajs.webpack.config"), {
    mode: "production",
    plugins: [
      new CleanPlugin(distDir),
      new HtmlWebpackPlugin({
        template: Path.resolve(rootPath, "src/main/resources/index.html"),
      }),
      new CopyPlugin({
        patterns: [{from: "*", context: assetsDir}],
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
