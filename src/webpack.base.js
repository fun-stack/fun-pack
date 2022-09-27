const fs = require('fs')
const Path = require("path");
const glob = require("glob");
const {patchSourceMap} = require("./webpack.sourcemap.js");

// Replaces md4 with sha256 to be compatible with recent node versions (16+)
// https://stackoverflow.com/a/69691525
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

const scalaJsBundlerConfigFile = "scalajs.webpack.config.js";

function findJsMainFile(workingDir, isProd) {
  const mode = isProd ? "opt" : "fastopt";

  const defaultJsFolders = glob.sync(Path.join(workingDir, "target", "scala-*", "*-" + mode));
  if (defaultJsFolders.length > 0) return Path.join(defaultJsFolders[0], "main.js");

  return Path.join(workingDir, "index.js");
}

function baseConfig(workingDir, entrypoint) {
  const path = Path.join(workingDir, scalaJsBundlerConfigFile);
  if (fs.existsSync(path)) {
    return patchSourceMap(require(path));
  }

  const isProd = process.env.NODE_ENV === "production";
  const jsEntrypoint = entrypoint != null ? entrypoint : findJsMainFile(workingDir, isProd);

  // create the directory for the entrypoint file, so webpack's watching will work even if the file does not yet exist.
  const jsEntrypointDirectory = Path.dirname(jsEntrypoint);
  fs.mkdirSync(jsEntrypointDirectory, {recursive: true})

  return {
    "entry": {
      "app": [jsEntrypoint]
    },
    "output": {
      "path": workingDir,
      "filename": "index.js"
      // "library": "ScalaJSBundlerLibrary",
      // "libraryTarget": "var"
    },
    "mode": isProd ? "production" : "development",
    "devtool": "source-map",
    "module": {
      "rules": [{
        "test": new RegExp("\\.js$"),
        "enforce": "pre",
        "use": ["@fun-stack/source-map-loader-no-warn"]
      }]
    }
  };
}

module.exports = {baseConfig: baseConfig};
