# fun-pack

A webpack plugin to use with scalajs projects with scalajs-bundler.

```sh
npm install @fun-stack/fun-pack
```

Provides webpack configs for web development (dev and prod) and lambda development (dev and prod).

Web (dev):
```javascript
const {webDev} = require("@fun-stack/fun-pack");

module.exports = webDev({
    indexHtml: "src/main/html/index.html",
    // assetsDir: "assets",
    // extraWatchDirs: [],
    // extraStaticDirs: []
});
```

Web (prod):
```javascript
const {webProd} = require("@fun-stack/fun-pack");

module.exports = webProd({
    indexHtml: "src/main/html/index.html",
    // assetsDir: "assets",
});
```

Lambda (dev):
```javascript
const {lambdaDev} = require("@fun-stack/fun-pack");

module.exports = lambdaDev({
    // assetsDir: "assets"
});
```

Lambda (prod):
```javascript
const {lambdaProd} = require("@fun-stack/fun-pack");

module.exports = lambdaProd({
    // assetsDir: "assets",
});
```
