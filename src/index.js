const {webDev} = require("./webpack.config.web.dev");
const {webProd} = require("./webpack.config.web.prod");
const {lambdaDev} = require("./webpack.config.lambda.dev");
const {lambdaProd} = require("./webpack.config.lambda.prod");
const {binProd} = require("./webpack.config.bin.prod");

module.exports = {webDev, webProd, lambdaDev, lambdaProd, binProd};
