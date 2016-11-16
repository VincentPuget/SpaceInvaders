"use strict";
const express = require("express");
const compression = require("compression");
const chalk = require("chalk");
const path = require("path");
const errorHandler = require("errorhandler");
const argv = require("yargs").argv;
const prod = !!argv.prod;
const config = require("./config/config").init(prod);

/**
 * Controllers (route handlers).
 */
const homeController = require("./controllers/home");


const app = express();

/**
 * Express configuration.
 */
app.set("port", config.port || 1337);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(compression());
app.use(express.static(path.join(__dirname, "assets"), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get("/", homeController.index);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log("%s Express server listening on port %d in %s mode.", chalk.green("✓"), app.get("port"), prod ? "prod" : "dev");
});

module.exports = app;
