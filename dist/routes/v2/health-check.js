"use strict";
var express = require("express");
var router = express.Router();
var RateLimit = require("express-rate-limit");
var healthCheckRateLimit = new RateLimit({
    windowMs: 60000,
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
router.get("/", healthCheckRateLimit, function (req, res, next) {
    res.json({ status: "winning v2" });
});
module.exports = router;
