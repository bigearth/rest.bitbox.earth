"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require("express");
var router = express.Router();
var axios = require("axios");
var RateLimit = require("express-rate-limit");
var BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
var BITBOX = new BITBOXCli();
var config = {
    addressRateLimit1: undefined,
    addressRateLimit2: undefined,
    addressRateLimit3: undefined,
    addressRateLimit4: undefined
};
var i = 1;
while (i < 6) {
    config["addressRateLimit" + i] = new RateLimit({
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
router.get("/", config.addressRateLimit1, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({ status: "address" });
        return [2 /*return*/];
    });
}); });
router.get("/details/:address", config.addressRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var addresses, result_1, path;
    return __generator(this, function (_a) {
        try {
            addresses = JSON.parse(req.params.address);
            // Enforce no more than 20 addresses.
            if (addresses.length > 20) {
                res.json({
                    error: "Array too large. Max 20 addresses"
                });
            }
            result_1 = [];
            addresses = addresses.map(function (address) {
                var path = process.env.BITCOINCOM_BASEURL + "addr/" + BITBOX.Address.toLegacyAddress(address);
                return axios.get(path); // Returns a promise.
            });
            axios.all(addresses).then(axios.spread(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i_1 = 0; i_1 < args.length; i_1++) {
                    var parsed = args[i_1].data;
                    parsed.legacyAddress = BITBOX.Address.toLegacyAddress(parsed.addrStr);
                    parsed.cashAddress = BITBOX.Address.toCashAddress(parsed.addrStr);
                    delete parsed.addrStr;
                    result_1.push(parsed);
                }
                res.json(result_1);
            }));
        }
        catch (error) {
            path = process.env.BITCOINCOM_BASEURL + "addr/" + BITBOX.Address.toLegacyAddress(req.params.address);
            if (req.query.from && req.query.to)
                path = path + "?from=" + req.query.from + "&to=" + req.query.to;
            axios
                .get(path)
                .then(function (response) {
                var parsed = response.data;
                delete parsed.addrStr;
                parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
                parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
                res.json(parsed);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/utxo/:address", config.addressRateLimit3, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var addresses_1, final_1;
    return __generator(this, function (_a) {
        try {
            addresses_1 = JSON.parse(req.params.address);
            if (addresses_1.length > 20) {
                res.json({
                    error: "Array too large. Max 20 addresses"
                });
            }
            addresses_1 = addresses_1.map(function (address) {
                return BITBOX.Address.toLegacyAddress(address);
            });
            final_1 = [];
            addresses_1.forEach(function (address) {
                final_1.push([]);
            });
            axios
                .get(process.env.BITCOINCOM_BASEURL + "addrs/" + addresses_1 + "/utxo")
                .then(function (response) {
                var parsed = response.data;
                parsed.forEach(function (data) {
                    data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
                    data.cashAddress = BITBOX.Address.toCashAddress(data.address);
                    delete data.address;
                    addresses_1.forEach(function (address, index) {
                        if (addresses_1[index] === data.legacyAddress)
                            final_1[index].push(data);
                    });
                });
                res.json(final_1);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        catch (error) {
            axios
                .get(process.env.BITCOINCOM_BASEURL + "addr/" + BITBOX.Address.toLegacyAddress(req.params.address) + "/utxo")
                .then(function (response) {
                var parsed = response.data;
                parsed.forEach(function (data) {
                    delete data.address;
                    data.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
                    data.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
                });
                res.json(parsed);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/unconfirmed/:address", config.addressRateLimit4, function (req, res, next) {
    try {
        var addresses_2 = JSON.parse(req.params.address);
        if (addresses_2.length > 20) {
            res.json({
                error: "Array too large. Max 20 addresses"
            });
        }
        addresses_2 = addresses_2.map(function (address) {
            return BITBOX.Address.toLegacyAddress(address);
        });
        var final_2 = [];
        addresses_2.forEach(function (address) {
            final_2.push([]);
        });
        axios
            .get(process.env.BITCOINCOM_BASEURL + "addrs/" + addresses_2 + "/utxo")
            .then(function (response) {
            var parsed = response.data;
            parsed.forEach(function (data) {
                data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
                data.cashAddress = BITBOX.Address.toCashAddress(data.address);
                delete data.address;
                if (data.confirmations === 0) {
                    addresses_2.forEach(function (address, index) {
                        if (addresses_2[index] === data.legacyAddress)
                            final_2[index].push(data);
                    });
                }
            });
            res.json(final_2);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
    catch (error) {
        axios
            .get(process.env.BITCOINCOM_BASEURL + "addr/" + BITBOX.Address.toLegacyAddress(req.params.address) + "/utxo")
            .then(function (response) {
            var parsed = response.data;
            var unconfirmed = [];
            parsed.forEach(function (data) {
                data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
                data.cashAddress = BITBOX.Address.toCashAddress(data.address);
                delete data.address;
                if (data.confirmations === 0)
                    unconfirmed.push(data);
            });
            res.json(unconfirmed);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
router.get("/unconfirmed/:address", config.addressRateLimit4, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var addresses, final_3;
    return __generator(this, function (_a) {
        try {
            addresses = JSON.parse(req.params.address);
            if (addresses.length > 20) {
                res.json({
                    error: "Array too large. Max 20 addresses"
                });
            }
            addresses = addresses.map(function (address) {
                return BITBOX.Address.toLegacyAddress(address);
            });
            final_3 = [];
            addresses.forEach(function (address) {
                final_3.push([]);
            });
            axios
                .get(process.env.BITCOINCOM_BASEURL + "txs/?address=" + addresses)
                .then(function (response) {
                res.json(response.data);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        catch (error) {
            axios
                .get(process.env.BITCOINCOM_BASEURL + "txs/?address=" + BITBOX.Address.toLegacyAddress(req.params.address))
                .then(function (response) {
                res.json(response.data);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/transactions/:address", config.addressRateLimit5, function (req, res, next) {
    try {
        var addresses = JSON.parse(req.params.address);
        if (addresses.length > 20) {
            res.json({
                error: "Array too large. Max 20 addresses"
            });
        }
        addresses = addresses.map(function (address) {
            return BITBOX.Address.toLegacyAddress(address);
        });
        var final_4 = [];
        addresses.forEach(function (address) {
            final_4.push([]);
        });
        axios
            .get(process.env.BITCOINCOM_BASEURL + "txs/?address=" + addresses)
            .then(function (response) {
            res.json(response.data);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
    catch (error) {
        axios
            .get(process.env.BITCOINCOM_BASEURL + "txs/?address=" + BITBOX.Address.toLegacyAddress(req.params.address))
            .then(function (response) {
            res.json(response.data);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
module.exports = router;
