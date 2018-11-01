"use strict";
var express = require("express");
var router = express.Router();
var RateLimit = require("express-rate-limit");
var indexRateLimit1 = new RateLimit({
    windowMs: 60 * 60 * 1000,
    delayMs: 0,
    max: 60,
    handler: function (req, res /*next*/) {
        res.format({
            json: function () {
                res.status(500).json({
                    error: "Too many requests. Limits are 60 requests per minute."
                });
            }
        });
    }
});
/* GET home page. */
router.get("/v2", indexRateLimit1, function (req, res, next) {
    res.render("swagger-v2");
});
module.exports = router;
