/**
 * GET /
 * Home page.
 */
"use strict";

module.exports.index = (req, res) => {
  res.render("pages/home", {
    title: "Home"
  });
};
