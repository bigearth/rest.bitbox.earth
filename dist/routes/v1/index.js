"use strict";
var express = require("express");
var router = express.Router();
var RateLimit = require("express-rate-limit");
var config = {
    indexRateLimit1: undefined
};
var i = 1;
while (i < 2) {
    config["indexRateLimit" + i] = new RateLimit({
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
    i++;
}
/* GET home page. */
router.get("/", config.indexRateLimit1, function (req, res, next) {
    res.render("swagger");
});
module.exports = router;
