"use strict";
var express = require("express");
var router = express.Router();
var axios = require("axios");
var RateLimit = require("express-rate-limit");
//const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
//const BITBOX = new BITBOXCli();
var BitboxHTTP = axios.create({
    baseURL: process.env.RPC_BASEURL
});
var username = process.env.RPC_USERNAME;
var password = process.env.RPC_PASSWORD;
var config = {
    blockRateLimit1: undefined,
    blockRateLimit2: undefined
};
var i = 1;
while (i < 3) {
    config["blockRateLimit" + i] = new RateLimit({
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
    i++;
}
router.get("/", config.blockRateLimit1, function (req, res, next) {
    res.json({ status: "block" });
});
router.get("/details/:id", config.blockRateLimit2, function (req, res, next) {
    if (req.params.id.length !== 64) {
        BitboxHTTP({
            method: "post",
            auth: {
                username: username,
                password: password
            },
            data: {
                jsonrpc: "1.0",
                id: "getblockhash",
                method: "getblockhash",
                params: [parseInt(req.params.id)]
            }
        })
            .then(function (response) {
            axios
                .get(process.env.BITCOINCOM_BASEURL + "block/" + response.data.result)
                .then(function (response) {
                var parsed = response.data;
                res.json(parsed);
            })
                .catch(function (error) {
                //res.send(error.response.data.error.message)
                res.status(500);
                return res.send(error);
            });
        })
            .catch(function (error) {
            //res.send(error.response.data.error.message)
            res.status(500);
            return res.send(error);
        });
    }
    else {
        axios
            .get(process.env.BITCOINCOM_BASEURL + "block/" + req.params.id)
            .then(function (response) {
            var parsed = response.data;
            res.json(parsed);
        })
            .catch(function (error) {
            //res.send(error.response.data.error.message)
            res.status(500);
            return res.send(error);
        });
    }
});
module.exports = router;
