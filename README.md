# fun-pack

A webpack plugin to use with scalajs projects.

This tool tries to detect if it is run with scalajs-bundler or not. If yes, it will use the generated webpack config from scalajs-bundler as a base and will add things on top. Otherwise, it will generate the whole webpack config. It should work equivalently and transparently.

Provides webpack configs for web development (dev and prod) and lambda development (dev and prod) and node executables (prod).

## Usage

Install:
```sh
npm install @fun-stack/fun-pack
```

Use the following snippets as your webpack config.

### Web

Web (dev):
```javascript
const {webDev} = require("@fun-stack/fun-pack");

module.exports = webDev({
    // entrypoint: "entrypoint.js", // not needed with scalajs-bundler
    indexHtml: "src/main/html/index.html",
    // assetsDir: "assets",
    // extraWatchDirs: [],
    // extraStaticDirs: []
    // outputDir: "dev",
});
```

Web (prod):
```javascript
const {webProd} = require("@fun-stack/fun-pack");

module.exports = webProd({
    // entrypoint: "entrypoint.js", // not needed with scalajs-bundler
    indexHtml: "src/main/html/index.html",
    // assetsDir: "assets",
    // outputDir: "dist",
});
```

### Lambda

Lambda (dev):
```javascript
const {lambdaDev} = require("@fun-stack/fun-pack");

module.exports = lambdaDev({
    // entrypoint: "entrypoint.js", // not needed with scalajs-bundler
    // assetsDir: "assets",
    // outputDir: "dev",
});
```

Lambda (prod):
```javascript
const {lambdaProd} = require("@fun-stack/fun-pack");

module.exports = lambdaProd({
    // entrypoint: "entrypoint.js", // not needed with scalajs-bundler
    // assetsDir: "assets",
    // outputDir: "dist",

});
```

### Node executable

Node executable (prod):
```javascript
const {binProd} = require("@fun-stack/fun-pack");

module.exports = binProd({
    // entrypoint: "entrypoint.js", // not needed with scalajs-bundler
    // fileName: "output.js",
    // outputDir: "dist",
});
```
