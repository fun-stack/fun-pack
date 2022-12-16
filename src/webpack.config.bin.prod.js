const {baseConfig} = require("./webpack.base.js");
const webpack = require('webpack');
const Path = require('path');
const fs = require('fs');
const {merge} = require("webpack-merge");

const wd = Path.resolve(Path.dirname(module.parent.parent.filename));

function prod(argsRaw) {
  process.env.NODE_ENV = "production";

  const args = Object.assign({
    entrypoint: null,
    fileName: "index.js",
    outputDir: "dist",
  }, argsRaw);

  const outputDir = Path.join(wd, args.outputDir);
  const fileName = args.fileName

  return merge(baseConfig(wd, args.entrypoint), {
    mode: "production",
    target: "node",
    output: {
      path: outputDir,
      filename: fileName,
      clean: true,
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: '#!/usr/bin/env -S node --enable-source-maps',
        raw: true,
      }),
      {
        apply: (compiler) => {
          compiler.hooks.done.tap('done', () => fs.chmodSync(Path.join(outputDir, fileName), '755'))
        }
      },
    ],
  });
}

module.exports = {binProd: prod};
