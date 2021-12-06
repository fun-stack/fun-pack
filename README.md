# fun-pack

A webpack plugin to use with scalajs projects.

Provides webpack configs for web development (dev and prod) and lambda development (dev and prod).

Web (dev):
```javascript
const {webDev} = require("fun-pack");

module.exports = webDev({
    assetsDir: "assets",
    indexHtml: "src/main/html/index.html",
    extraWatchDirs: [],
});
```

Web (prod):
```javascript
const {webProd} = require("fun-pack");

module.exports = webProd({
    assetsDir: "assets",
    indexHtml: "src/main/html/index.html",
});
```

Lambda (prod):
```javascript
const {lambdaProd} = require("fun-pack");

module.exports = lambdaProd();
```