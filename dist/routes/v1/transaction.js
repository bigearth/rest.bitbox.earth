"use strict";
var express = require("express");
var router = express.Router();
var axios = require("axios");
var RateLimit = require("express-rate-limit");
var BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
var BITBOX = new BITBOXCli();
var config = {
    transactionRateLimit1: undefined,
    transactionRateLimit2: undefined
};
var processInputs = function (tx) {
    if (tx.vin) {
        tx.vin.forEach(function (vin) {
            if (!vin.coinbase) {
                var address = vin.addr;
                vin.legacyAddress = BITBOX.Address.toLegacyAddress(address);
                vin.cashAddress = BITBOX.Address.toCashAddress(address);
                vin.value = vin.valueSat;
                delete vin.addr;
                delete vin.valueSat;
                delete vin.doubleSpentTxID;
            }
        });
    }
};
var i = 1;
while (i < 6) {
    config["transactionRateLimit" + i] = new RateLimit({
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
router.get("/", config.transactionRateLimit1, function (req, res, next) {
    res.json({ status: "transaction" });
});
router.get("/details/:txid", config.transactionRateLimit1, function (req, res, next) {
    try {
        var txs = JSON.parse(req.params.txid);
        if (txs.length > 20) {
            res.json({
                error: "Array too large. Max 20 txids"
            });
        }
        var result_1 = [];
        txs = txs.map(function (tx) { return axios.get(process.env.BITCOINCOM_BASEURL + "tx/" + tx); });
        axios.all(txs).then(axios.spread(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i_1 = 0; i_1 < args.length; i_1++) {
                var parsed = args[i_1].data;
                result_1.push(parsed);
            }
            result_1.forEach(function (tx) {
                processInputs(tx);
            });
            res.json(result_1);
        }));
    }
    catch (error) {
        axios
            .get(process.env.BITCOINCOM_BASEURL + "tx/" + req.params.txid)
            .then(function (response) {
            var parsed = response.data;
            if (parsed)
                processInputs(parsed);
            res.json(parsed);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
module.exports = router;
