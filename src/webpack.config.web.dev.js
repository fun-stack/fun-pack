const {baseConfig} = require("./webpack.base.js");
const Path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");

const wd = Path.resolve(Path.dirname(module.parent.parent.filename));

const isScalaJsBundler = wd.includes("scalajs-bundler") && wd.includes("main");
const relativeCorrection = isScalaJsBundler ? "../../../.." : ".";
const rootPath = Path.resolve(wd, relativeCorrection);
const distDir = Path.join(wd, "dev");

function dev(argsRaw) {
  const args = Object.assign({
    entrypoint: null,
    indexHtml: null,
    assetsDir: null,
    extraWatchDirs: [],
    extraStaticDirs: []
  }, argsRaw);

  const indexHtml = args.indexHtml ? Path.resolve(rootPath, args.indexHtml) : null;
  const assetsDir = args.assetsDir ? Path.join(rootPath, args.assetsDir) : null;
  const extraWatchDirs = args.extraWatchDirs.map(path => Path.join(rootPath, path));
  //TODO: switch to webpack dev server 5, then we do not need this rewrites/ignore workaround for static assets.
  const extraStaticDirs = args.extraStaticDirs.map(path => {
    return {
      path: Path.join(rootPath, path),
      dir: path
    };
  });

  const staticCopyFiles = [
    glob.sync(Path.join(wd, "*-fastopt-loader.js")),
    glob.sync(Path.join(wd, "*-fastopt.js")),
    glob.sync(Path.join(wd, "*-fastopt.js.map"))
  ].flat().map(path => Path.basename(path));

  return merge(baseConfig(wd, args.entrypoint), {
    node: false, //disable automatic node polyfills from webpack 4, webpack 5 has this disabled by default.
    resolve: {
      modules: [rootPath, wd, Path.join(wd, "node_modules")],
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(false),
      }),
      new CleanWebpackPlugin(),
    ].concat(
      indexHtml ? [
        new HtmlWebpackPlugin({
          template: indexHtml
        })
      ] : []
    ).concat(
      staticCopyFiles.length > 0 ? new CopyPlugin({
        patterns: staticCopyFiles.map((f) => {
          return {from: f, context: Path.dirname(f), force: true};
        }),
      }) : []
    ).concat([
      new HtmlWebpackTagsPlugin({
        tags: staticCopyFiles.filter((name) => name.endsWith(".js")),
      }),
    ]),
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    devServer: {
      contentBase: [distDir].concat(assetsDir ? [assetsDir] : []).concat(extraWatchDirs).concat(extraStaticDirs.map(x => x.path)),
      allowedHosts: [".localhost"],
      disableHostCheck: false,
      compress: false,
      watchContentBase: true,
      watchOptions: {
        ignored: (f) => f.endsWith(".tmp") || extraStaticDirs.some(d => f.startsWith(d.path))
      },
      historyApiFallback: {
        rewrites: extraStaticDirs.map(d => {
          const regex = new RegExp(`^/${d.dir}/`, '');
          return {
            from: regex,
            to: context => context.parsedUrl.pathname.replace(regex, '')
          };
        })
      },
      // writeToDisk: true,
      hot: false,
      hotOnly: false,
      inline: true,
    },
    output: {path: distDir},
  })
}

module.exports = {webDev: dev};
