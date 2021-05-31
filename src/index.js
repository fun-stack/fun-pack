const {webDev} = require("./webpack.config.web.dev");
const {webProd} = require("./webpack.config.web.prod");
const {lambdaProd} = require("./webpack.config.lambda.prod");

module.exports = {webDev, webProd, lambdaProd};
