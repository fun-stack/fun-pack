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

function dev(argsRaw) {
  const args = Object.assign({
    entrypoint: null,
    outputDir: "dev",
    indexHtml: null,
    assetsDir: null,
    extraStatic: [],
  }, argsRaw);

  if (args.extraWatchDirs) {
    console.error(`You are using the deprecated 'extraWatchDirs' option for fun-pack.
Please use this instead:
  extraStatic: [
    {
      publicPath: "/my-sub-project",
      directory: "relative/path/from/sub-project",
      watch: true,
    }
  ]`
    );

    process.exit(1)
  }

  if (args.extraStaticDirs) {
    console.error(`You are using the deprecated 'extraStaticDirs' option for fun-pack.
Please use this instead:
  extraStatic: [
    {
      publicPath: "/my-sub-project",
      directory: "relative/path/from/sub-project",
      watch: false,
    }
  ]`
    );

    process.exit(1)
  }

  const outputDir = Path.join(wd, args.outputDir);
  const indexHtml = args.indexHtml ? Path.resolve(rootPath, args.indexHtml) : null;
  const assetsDir = args.assetsDir ? Path.join(rootPath, args.assetsDir) : null;
  const extraStatic = args.extraStatic;

  const allWatchDirs = [outputDir].concat(assetsDir ? [assetsDir] : [])

  const allStatic = extraStatic.map(obj =>
        Object.assign(
  {}, obj, {
          directory: obj.directory && Path.join(rootPath, obj.directory),
        })
      ).concat(allWatchDirs.map(path => {
        return {
          directory: path,
          watch: {
            ignored: (f) => f.endsWith(".tmp"),
          },
        };
      }))

  const staticCopyFiles = [
    glob.sync(Path.join(wd, "*-fastopt-loader.js")),
    glob.sync(Path.join(wd, "*-fastopt.js")),
    glob.sync(Path.join(wd, "*-fastopt.js.map"))
  ].flat().map(path => Path.basename(path));

  return merge(baseConfig(wd, args.entrypoint), {
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
      devMiddleware: {
        writeToDisk: (filePath) => {
          return /\.js$/.test(filePath);
        },
      },
      allowedHosts: [".localhost"],
      compress: false,
      static: allStatic,
      hot: false,
    },
    output: {path: outputDir},
  })
}

module.exports = {webDev: dev};
