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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var axios_1 = require("axios");
var RateLimit = require("express-rate-limit");
var BitboxHTTP = axios_1.default.create({
    baseURL: process.env.RPC_BASEURL
});
var username = process.env.RPC_USERNAME;
var password = process.env.RPC_PASSWORD;
var requestConfig = {
    method: "post",
    auth: {
        username: username,
        password: password
    },
    data: {
        jsonrpc: "1.0"
    }
};
var config = {
    blockchainRateLimit1: undefined,
    blockchainRateLimit2: undefined,
    blockchainRateLimit3: undefined,
    blockchainRateLimit4: undefined,
    blockchainRateLimit5: undefined,
    blockchainRateLimit6: undefined,
    blockchainRateLimit7: undefined,
    blockchainRateLimit8: undefined,
    blockchainRateLimit9: undefined,
    blockchainRateLimit10: undefined,
    blockchainRateLimit11: undefined,
    blockchainRateLimit12: undefined,
    blockchainRateLimit13: undefined,
    blockchainRateLimit14: undefined,
    blockchainRateLimit15: undefined,
    blockchainRateLimit16: undefined,
    blockchainRateLimit17: undefined
};
var i = 1;
while (i < 18) {
    config["blockchainRateLimit" + i] = new RateLimit({
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
router.get("/", config.blockchainRateLimit1, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({ status: "blockchain" });
        return [2 /*return*/];
    });
}); });
router.get("/getBestBlockHash", config.blockchainRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "getbestblockhash";
                requestConfig.data.method = "getbestblockhash";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).send(error_1.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getBlock/:hash", config.blockchainRateLimit3, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var verbose, showTxs, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                verbose = false;
                if (req.query.verbose && req.query.verbose === "true")
                    verbose = true;
                showTxs = true;
                if (req.query.txs && req.query.txs === "false")
                    showTxs = false;
                requestConfig.data.id = "getblock";
                requestConfig.data.method = "getblock";
                requestConfig.data.params = [req.params.hash, verbose];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                if (!showTxs)
                    delete response.data.result.tx;
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).send(error_2.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getBlockchainInfo", config.blockchainRateLimit4, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "getblockchaininfo";
                requestConfig.data.method = "getblockchaininfo";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).send(error_3.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getBlockCount", config.blockchainRateLimit5, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "getblockcount";
                requestConfig.data.method = "getblockcount";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).send(error_4.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getBlockHash/:height", config.blockchainRateLimit6, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var heights, result_1;
    return __generator(this, function (_a) {
        try {
            heights = JSON.parse(req.params.height);
            if (heights.length > 20) {
                res.json({
                    error: "Array too large. Max 20 heights"
                });
            }
            result_1 = [];
            heights = heights.map(function (height) {
                return BitboxHTTP({
                    method: "post",
                    auth: {
                        username: username,
                        password: password
                    },
                    data: {
                        jsonrpc: "1.0",
                        id: "getblockhash",
                        method: "getblockhash",
                        params: [height]
                    }
                }).catch(function (error) {
                    try {
                        return {
                            data: {
                                result: error.response.data.error.message
                            }
                        };
                    }
                    catch (ex) {
                        return {
                            data: {
                                result: "unknown error"
                            }
                        };
                    }
                });
            });
            axios_1.default.all(heights).then(axios_1.default.spread(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i_1 = 0; i_1 < args.length; i_1++) {
                    var tmp = {};
                    var parsed = tmp.data.result;
                    result_1.push(parsed);
                }
                res.json(result_1);
            }));
        }
        catch (error) {
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
                    params: [parseInt(req.params.height)]
                }
            })
                .then(function (response) {
                res.json(response.data.result);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/getBlockHeader/:hash", config.blockchainRateLimit7, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var verbose, hashes, result_2;
    return __generator(this, function (_a) {
        verbose = false;
        if (req.query.verbose && req.query.verbose === "true")
            verbose = true;
        try {
            hashes = JSON.parse(req.params.hash);
            if (hashes.length > 20) {
                res.json({
                    error: "Array too large. Max 20 hashes"
                });
            }
            result_2 = [];
            hashes = hashes.map(function (hash) {
                return BitboxHTTP({
                    method: "post",
                    auth: {
                        username: username,
                        password: password
                    },
                    data: {
                        jsonrpc: "1.0",
                        id: "getblockheader",
                        method: "getblockheader",
                        params: [hash, verbose]
                    }
                }).catch(function (error) {
                    try {
                        return {
                            data: {
                                result: error.response.data.error.message
                            }
                        };
                    }
                    catch (ex) {
                        return {
                            data: {
                                result: "unknown error"
                            }
                        };
                    }
                });
            });
            axios_1.default.all(hashes).then(axios_1.default.spread(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i_2 = 0; i_2 < args.length; i_2++) {
                    var tmp = {};
                    var parsed = tmp.data.result;
                    result_2.push(parsed);
                }
                res.json(result_2);
            }));
        }
        catch (error) {
            BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "getblockheader",
                    method: "getblockheader",
                    params: [req.params.hash, verbose]
                }
            })
                .then(function (response) {
                res.json(response.data.result);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/getChainTips", config.blockchainRateLimit8, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "getchaintips";
                requestConfig.data.method = "getchaintips";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).send(error_5.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getDifficulty", config.blockchainRateLimit9, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "getdifficulty";
                requestConfig.data.method = "getdifficulty";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(500).send(error_6.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getMempoolAncestors/:txid", config.blockchainRateLimit10, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var verbose, txids, result_3;
    return __generator(this, function (_a) {
        verbose = false;
        if (req.query.verbose && req.query.verbose === "true")
            verbose = true;
        try {
            txids = JSON.parse(req.params.txid);
            if (txids.length > 20) {
                res.json({
                    error: "Array too large. Max 20 txids"
                });
            }
            result_3 = [];
            txids = txids.map(function (txid) {
                return BitboxHTTP({
                    method: "post",
                    auth: {
                        username: username,
                        password: password
                    },
                    data: {
                        jsonrpc: "1.0",
                        id: "getmempoolancestors",
                        method: "getmempoolancestors",
                        params: [txid, verbose]
                    }
                }).catch(function (error) {
                    try {
                        return {
                            data: {
                                result: error.response.data.error.message
                            }
                        };
                    }
                    catch (ex) {
                        return {
                            data: {
                                result: "unknown error"
                            }
                        };
                    }
                });
            });
            axios_1.default.all(txids).then(axios_1.default.spread(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i_3 = 0; i_3 < args.length; i_3++) {
                    var tmp = {};
                    var parsed = tmp.data.result;
                    result_3.push(parsed);
                }
                res.json(result_3);
            }));
        }
        catch (error) {
            BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "getmempoolancestors",
                    method: "getmempoolancestors",
                    params: [req.params.txid, verbose]
                }
            })
                .then(function (response) {
                res.json(response.data.result);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/getMempoolDescendants/:txid", config.blockchainRateLimit11, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var verbose, txids, result_4;
    return __generator(this, function (_a) {
        verbose = false;
        if (req.query.verbose && req.query.verbose === "true")
            verbose = true;
        try {
            txids = JSON.parse(req.params.txid);
            if (txids.length > 20) {
                res.json({
                    error: "Array too large. Max 20 txids"
                });
            }
            result_4 = [];
            txids = txids.map(function (txid) {
                return BitboxHTTP({
                    method: "post",
                    auth: {
                        username: username,
                        password: password
                    },
                    data: {
                        jsonrpc: "1.0",
                        id: "getmempooldescendants",
                        method: "getmempooldescendants",
                        params: [txid, verbose]
                    }
                }).catch(function (error) {
                    try {
                        return {
                            data: {
                                result: error.response.data.error.message
                            }
                        };
                    }
                    catch (ex) {
                        return {
                            data: {
                                result: "unknown error"
                            }
                        };
                    }
                });
            });
            axios_1.default.all(txids).then(axios_1.default.spread(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i_4 = 0; i_4 < args.length; i_4++) {
                    var tmp = {};
                    var parsed = tmp.data.result;
                    result_4.push(parsed);
                }
                res.json(result_4);
            }));
        }
        catch (error) {
            BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "getmempooldescendants",
                    method: "getmempooldescendants",
                    params: [req.params.txid, verbose]
                }
            })
                .then(function (response) {
                res.json(response.data.result);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/getMempoolEntry/:txid", config.blockchainRateLimit12, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var txids, result_5;
    return __generator(this, function (_a) {
        try {
            txids = JSON.parse(req.params.txid);
            if (txids.length > 20) {
                res.json({
                    error: "Array too large. Max 20 txids"
                });
            }
            result_5 = [];
            txids = txids.map(function (txid) {
                return BitboxHTTP({
                    method: "post",
                    auth: {
                        username: username,
                        password: password
                    },
                    data: {
                        jsonrpc: "1.0",
                        id: "getmempoolentry",
                        method: "getmempoolentry",
                        params: [txid]
                    }
                }).catch(function (error) {
                    try {
                        return {
                            data: {
                                result: error.response.data.error.message
                            }
                        };
                    }
                    catch (ex) {
                        return {
                            data: {
                                result: "unknown error"
                            }
                        };
                    }
                });
            });
            axios_1.default.all(txids).then(axios_1.default.spread(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i_5 = 0; i_5 < args.length; i_5++) {
                    var tmp = {};
                    var parsed = tmp.data.result;
                    result_5.push(parsed);
                }
                res.json(result_5);
            }));
        }
        catch (error) {
            BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "getmempoolentry",
                    method: "getmempoolentry",
                    params: [req.params.txid]
                }
            })
                .then(function (response) {
                res.json(response.data.result);
            })
                .catch(function (error) {
                res.send(error.response.data.error.message);
            });
        }
        return [2 /*return*/];
    });
}); });
router.get("/getMempoolInfo", config.blockchainRateLimit13, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "getmempoolinfo";
                requestConfig.data.method = "getmempoolinfo";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                res.status(500).send(error_7.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getRawMempool", config.blockchainRateLimit14, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var verbose, response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                verbose = false;
                if (req.query.verbose && req.query.verbose === "true")
                    verbose = true;
                requestConfig.data.id = "getrawmempool";
                requestConfig.data.method = "getrawmempool";
                requestConfig.data.params = [verbose];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.status(500).send(error_8.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getTxOut/:txid/:n", config.blockchainRateLimit15, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var include_mempool, response, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                include_mempool = false;
                if (req.query.include_mempool && req.query.include_mempool === "true")
                    include_mempool = true;
                requestConfig.data.id = "gettxout";
                requestConfig.data.method = "gettxout";
                requestConfig.data.params = [
                    req.params.txid,
                    parseInt(req.params.n),
                    include_mempool
                ];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                res.status(500).send(error_9.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/getTxOutProof/:txids", config.blockchainRateLimit16, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "gettxoutproof";
                requestConfig.data.method = "gettxoutproof";
                requestConfig.data.params = [req.params.txids];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                res.status(500).send(error_10.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//
// router.get('/preciousBlock/:hash', async (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"preciousblock",
//       method: "preciousblock",
//       params: [
//         req.params.hash
//       ]
//     }
//   })
//   .then((response) => {
//     res.json(JSON.stringify(response.data.result));
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.post('/pruneBlockchain/:height', async (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"pruneblockchain",
//       method: "pruneblockchain",
//       params: [
//         req.params.height
//       ]
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.get('/verifyChain', async (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"verifychain",
//       method: "verifychain"
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
router.get("/verifyTxOutProof/:proof", config.blockchainRateLimit17, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "verifytxoutproof";
                requestConfig.data.method = "verifytxoutproof";
                requestConfig.data.params = [req.params.proof];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                res.status(500).send(error_11.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
