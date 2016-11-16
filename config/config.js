/**
 * Config
 */
"use strict";
const _ = require("lodash");
const _default_ = require("./_default_");

module.exports.init = (isProd) => {
  let env = require("./env/development");
  if(isProd){
    env = require("./env/production");
  }
  return _.merge({}, _default_, env);
};
