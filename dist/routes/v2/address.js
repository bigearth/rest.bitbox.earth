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
var express = require("express");
var router = express.Router();
var axios = require("axios");
var RateLimit = require("express-rate-limit");
var logger = require("./logging.js");
var routeUtils = require("./route-utils");
// Used for processing error messages before sending them to the user.
var util = require("util");
util.inspect.defaultOptions = { depth: 1 };
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
// Connect the route endpoints to their handler functions.
router.get("/", config.addressRateLimit1, root);
router.post("/details", config.addressRateLimit2, details);
router.post("/utxo/:address", config.addressRateLimit3, utxo);
router.post("/unconfirmed/:address", config.addressRateLimit4, unconfirmed);
router.post("/transactions/:address", config.addressRateLimit5, transactions);
// Root API endpoint. Simply acknowledges that it exists.
function root(req, res, next) {
    return res.json({ status: "address" });
}
// Retrieve details on an address.
// curl -d '{"addresses": ["bchtest:qzjtnzcvzxx7s0na88yrg3zl28wwvfp97538sgrrmr", "bchtest:qp6hgvevf4gzz6l7pgcte3gaaud9km0l459fa23dul"]}' -H "Content-Type: application/json" http://localhost:3000/v2/address/details
// curl -d '{"addresses": ["bchtest:qzjtnzcvzxx7s0na88yrg3zl28wwvfp97538sgrrmr", "bchtest:qp6hgvevf4gzz6l7pgcte3gaaud9km0l459fa23dul"], "from": 1, "to": 5}' -H "Content-Type: application/json" http://localhost:3000/v2/address/details
function details(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var addresses, retArray, i_1, thisAddress, legacyAddr, networkIsValid, path, response, retData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    addresses = req.body.addresses;
                    // Reject if address is not an array.
                    if (!Array.isArray(addresses)) {
                        res.status(400);
                        return [2 /*return*/, res.json({ error: "addresses needs to be an array" })];
                    }
                    logger.debug("Executing address/details with these addresses: ", addresses);
                    retArray = [];
                    i_1 = 0;
                    _a.label = 1;
                case 1:
                    if (!(i_1 < addresses.length)) return [3 /*break*/, 4];
                    thisAddress = addresses[i_1] // Current address.
                    ;
                    // Ensure the input is a valid BCH address.
                    try {
                        legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress);
                    }
                    catch (err) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid BCH address. Double check your address is valid: " + thisAddress
                            })];
                    }
                    networkIsValid = routeUtils.validateNetwork(thisAddress);
                    if (!networkIsValid) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid network. Trying to use a testnet address on mainnet, or vice versa."
                            })];
                    }
                    path = process.env.BITCOINCOM_BASEURL + "addr/" + legacyAddr;
                    // Optional query strings limit the number of TXIDs.
                    // https://github.com/bitpay/insight-api/blob/master/README.md#notes-on-upgrading-from-v02
                    if (req.body.from && req.body.to)
                        path = path + "?from=" + req.body.from + "&to=" + req.body.to;
                    return [4 /*yield*/, axios.get(path)
                        // Append different address formats to the return data.
                    ];
                case 2:
                    response = _a.sent();
                    retData = response.data;
                    retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress);
                    retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress);
                    retArray.push(retData);
                    _a.label = 3;
                case 3:
                    i_1++;
                    return [3 /*break*/, 1];
                case 4:
                    // Return the array of retrieved address information.
                    res.status(200);
                    return [2 /*return*/, res.json(retArray)];
                case 5:
                    error_1 = _a.sent();
                    // Write out error to error log.
                    //logger.error(`Error in address/details: `, error)
                    // Return error message to the caller.
                    res.status(500);
                    if (error_1.response && error_1.response.data && error_1.response.data.error)
                        return [2 /*return*/, res.json({ error: error_1.response.data.error })];
                    return [2 /*return*/, res.json({ error: util.inspect(error_1) })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Retrieve UTXO information for an address.
function utxo(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var addresses, retArray, i_2, thisAddress, legacyAddr, networkIsValid, path, response, retData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    addresses = req.body.addresses;
                    // Reject if address is not an array.
                    if (!Array.isArray(addresses)) {
                        res.status(400);
                        return [2 /*return*/, res.json({ error: "addresses needs to be an array" })];
                    }
                    logger.debug("Executing address/utxo with these addresses: ", addresses);
                    retArray = [];
                    i_2 = 0;
                    _a.label = 1;
                case 1:
                    if (!(i_2 < addresses.length)) return [3 /*break*/, 4];
                    thisAddress = addresses[i_2] // Current address.
                    ;
                    // Ensure the input is a valid BCH address.
                    try {
                        legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress);
                    }
                    catch (err) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid BCH address. Double check your address is valid: " + thisAddress
                            })];
                    }
                    networkIsValid = routeUtils.validateNetwork(thisAddress);
                    if (!networkIsValid) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid network. Trying to use a testnet address on mainnet, or vice versa."
                            })];
                    }
                    path = process.env.BITCOINCOM_BASEURL + "addr/" + legacyAddr + "/utxo";
                    return [4 /*yield*/, axios.get(path)
                        // Append different address formats to the return data.
                    ];
                case 2:
                    response = _a.sent();
                    retData = response.data;
                    retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress);
                    retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress);
                    retArray.push(retData);
                    _a.label = 3;
                case 3:
                    i_2++;
                    return [3 /*break*/, 1];
                case 4:
                    // Return the array of retrieved address information.
                    res.status(200);
                    return [2 /*return*/, res.json(retArray)];
                case 5:
                    err_1 = _a.sent();
                    // Write out error to error log.
                    //logger.error(`Error in address/details: `, error)
                    // Return error message to the caller.
                    res.status(500);
                    if (error.response && error.response.data && error.response.data.error)
                        return [2 /*return*/, res.json({ error: error.response.data.error })];
                    return [2 /*return*/, res.json({ error: util.inspect(error) })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Retrieve any unconfirmed TX information for a given address.
function unconfirmed(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var addresses, retArray, i_3, thisAddress, legacyAddr, networkIsValid, path, response, retData, j, thisUtxo, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    addresses = req.body.addresses;
                    // Reject if address is not an array.
                    if (!Array.isArray(addresses)) {
                        res.status(400);
                        return [2 /*return*/, res.json({ error: "addresses needs to be an array" })];
                    }
                    logger.debug("Executing address/utxo with these addresses: ", addresses);
                    retArray = [];
                    i_3 = 0;
                    _a.label = 1;
                case 1:
                    if (!(i_3 < addresses.length)) return [3 /*break*/, 4];
                    thisAddress = addresses[i_3] // Current address.
                    ;
                    // Ensure the input is a valid BCH address.
                    try {
                        legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress);
                    }
                    catch (err) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid BCH address. Double check your address is valid: " + thisAddress
                            })];
                    }
                    networkIsValid = routeUtils.validateNetwork(thisAddress);
                    if (!networkIsValid) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid network. Trying to use a testnet address on mainnet, or vice versa."
                            })];
                    }
                    path = process.env.BITCOINCOM_BASEURL + "addr/" + legacyAddr + "/utxo";
                    return [4 /*yield*/, axios.get(path)
                        // Append different address formats to the return data.
                    ];
                case 2:
                    response = _a.sent();
                    retData = response.data;
                    retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress);
                    retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress);
                    // Loop through each returned UTXO.
                    for (j = 0; j < retData.length; j++) {
                        thisUtxo = retData[j];
                        // Only interested in UTXOs with no confirmations.
                        if (thisUtxo.confirmations === 0)
                            retArray.push(thisUtxo);
                    }
                    _a.label = 3;
                case 3:
                    i_3++;
                    return [3 /*break*/, 1];
                case 4:
                    // Return the array of retrieved address information.
                    res.status(200);
                    return [2 /*return*/, res.json(retArray)];
                case 5:
                    err_2 = _a.sent();
                    // Write out error to error log.
                    //logger.error(`Error in address/details: `, error)
                    // Return error message to the caller.
                    res.status(500);
                    if (error.response && error.response.data && error.response.data.error)
                        return [2 /*return*/, res.json({ error: error.response.data.error })];
                    return [2 /*return*/, res.json({ error: util.inspect(error) })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Get an array of TX information for a given address.
function transactions(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var addresses, retArray, i_4, thisAddress, networkIsValid, path, response, retData, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    addresses = req.body.addresses;
                    // Reject if address is not an array.
                    if (!Array.isArray(addresses)) {
                        res.status(400);
                        return [2 /*return*/, res.json({ error: "addresses needs to be an array" })];
                    }
                    logger.debug("Executing address/utxo with these addresses: ", addresses);
                    retArray = [];
                    i_4 = 0;
                    _a.label = 1;
                case 1:
                    if (!(i_4 < addresses.length)) return [3 /*break*/, 4];
                    thisAddress = addresses[i_4] // Current address.
                    ;
                    // Ensure the input is a valid BCH address.
                    try {
                        BITBOX.Address.toLegacyAddress(thisAddress);
                    }
                    catch (err) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid BCH address. Double check your address is valid: " + thisAddress
                            })];
                    }
                    networkIsValid = routeUtils.validateNetwork(thisAddress);
                    if (!networkIsValid) {
                        res.status(400);
                        return [2 /*return*/, res.json({
                                error: "Invalid network. Trying to use a testnet address on mainnet, or vice versa."
                            })];
                    }
                    path = process.env.BITCOINCOM_BASEURL + "txs/?address=" + thisAddress;
                    return [4 /*yield*/, axios.get(path)
                        // Append different address formats to the return data.
                    ];
                case 2:
                    response = _a.sent();
                    retData = response.data;
                    retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress);
                    retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress);
                    retArray.push(retData);
                    _a.label = 3;
                case 3:
                    i_4++;
                    return [3 /*break*/, 1];
                case 4:
                    // Return the array of retrieved address information.
                    res.status(200);
                    return [2 /*return*/, res.json(retArray)];
                case 5:
                    err_3 = _a.sent();
                    // Write out error to error log.
                    //logger.error(`Error in address/details: `, error)
                    // Return error message to the caller.
                    res.status(500);
                    if (error.response && error.response.data && error.response.data.error)
                        return [2 /*return*/, res.json({ error: error.response.data.error })];
                    return [2 /*return*/, res.json({ error: util.inspect(error) })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    router: router,
    testableComponents: {
        root: root,
        details: details,
        utxo: utxo,
        unconfirmed: unconfirmed,
        transactions: transactions
    }
};
